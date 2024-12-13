import { AnchorProvider, BN, Program, Provider } from "@project-serum/anchor";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { MeanMultisig, IDL } from "./IDL/mf";
import { aborted } from "util";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { MEAN_MULTISIG_OPS } from "@mean-dao/mean-multisig-sdk";


export const MEAN_MULTISIG_PROGRAM = new PublicKey('FF7U7Vj1PpBkTPau7frwLLrUHrjkxTQLsH7U5K3T3B3j');

export type TransferSolParams = {
    multisig: PublicKey;
    destination: PublicKey;
    amount: number; // in SOL
    title: string;
    description: string;
    expirationDate: number; // Unix timestamp
  };
  

export class MeanFinanceSDK {
    public program: Program<MeanMultisig>;
    public connection: Connection;
    public provider: AnchorProvider;
    private wallet: NodeWallet;
    

    constructor(provider?: AnchorProvider, wallet?: NodeWallet) {
        this.program = new Program<MeanMultisig>(IDL as MeanMultisig, MEAN_MULTISIG_PROGRAM, provider);
        this.connection = this.program.provider.connection;
        this.wallet = wallet;
    }

    async getMultisigSignerPDA(multisig: PublicKey): Promise<[PublicKey, number]> {
        return PublicKey.findProgramAddress(
            [multisig.toBuffer()],
            this.program.programId
        );
    }

    async getTransactionDetailPDA(transaction: PublicKey): Promise<[PublicKey, number]> {
        return PublicKey.findProgramAddress(
            [Buffer.from("transaction_detail"), transaction.toBuffer()],
            this.program.programId
        );
    }

    async getSettingsPDA(): Promise<[PublicKey, number]> {
        return PublicKey.findProgramAddress(
            [Buffer.from("settings")],
            this.program.programId
        );
    }

    async getOpsPDA(): Promise<[PublicKey, number]> {
        return PublicKey.findProgramAddress(
            [Buffer.from("ops")],
            this.program.programId
        );
    }

    async createMultisig(
        owners: Array<{ address: PublicKey; name: string }>,
        threshold: number,
        label: string
    ): Promise<{ txSignature: string; multisigPubkey: PublicKey }> {
        // Input validation
        if (!owners || owners.length === 0) {
            throw new Error('Owners length must be non zero');
        }

        if (threshold <= 0 || threshold > owners.length) {
            throw new Error('Threshold must be between 1 and the number of owners');
        }

        if (label.length > 32) {
            throw new Error('Label must be less than 32 bytes');
        }

        // Check for duplicate owners
        const uniqueOwners = new Set(owners.map(owner => owner.address.toString()));
        if (uniqueOwners.size !== owners.length) {
            throw new Error('Owners must be unique');
        }

        // Validate owner names
        for (const owner of owners) {
            if (owner.name.length >= 32) {
                throw new Error('Owner name must have less than 32 bytes');
            }
        }

        // Generate a new keypair for the multisig account
        const multisigKeypair = Keypair.generate()

        const [multisigSigner, nonce] = await PublicKey.findProgramAddress(
            [multisigKeypair.publicKey.toBuffer()],
            this.program.programId
          );

        console.log(multisigSigner)
        
        // Get the settings account PDA
        const [settingsAddress] = await PublicKey.findProgramAddress(
            [Buffer.from('settings')],
            this.program.programId
        );

        // Get the ops account from settings
        const settings = await this.program.account.settings.fetch(settingsAddress);
        
        // Format owners for the instruction
        const formattedOwners = owners.map(owner => ({
            address: owner.address,
            name: owner.name
        }));

    
            // Create the multisig account
            const transaction = await this.program.methods
                .createMultisig(
                    formattedOwners,
                    new BN(threshold),
                    nonce,
                    label
                )
                .accounts({
                    proposer: this.wallet.publicKey,
                    multisig: multisigKeypair.publicKey,
                    opsAccount: MEAN_MULTISIG_OPS,
                    settings: settingsAddress,
                    systemProgram: SystemProgram.programId,
                })
                .transaction();

                console.log('Required signers:', transaction.signatures.map(s => s.publicKey.toString()));

                const recentBlockhash = await this.connection.getLatestBlockhash();

                transaction.recentBlockhash = recentBlockhash.blockhash;
                transaction.feePayer = this.wallet.publicKey;

                transaction.partialSign(...[multisigKeypair])
                await this.wallet.signTransaction(transaction);

                console.log('Signatures after signing:', transaction.signatures.map(s => ({
                    publicKey: s.publicKey.toString(),
                    signature: s.signature ? 'present' : 'missing'
                })));

                if (!transaction.signatures.some(sig => sig.publicKey.equals(this.wallet.publicKey))) {
                    await this.wallet.signTransaction(transaction);
                }

                const signature = await this.connection.sendTransaction(transaction, [this.wallet.payer, multisigKeypair]);

                console.log(signature)
                

            return {
                txSignature: signature,
                multisigPubkey: multisigKeypair.publicKey,
            };
        
    }

    async createTransferSolTransaction(params: TransferSolParams): Promise<string> {
        const {
            multisig,
            destination,
            amount,
            title,
            description,
            expirationDate,
        } = params;

        const transaction = Keypair.generate();
        const [multisigSigner] = await this.getMultisigSignerPDA(multisig);
        const [transactionDetail] = await this.getTransactionDetailPDA(transaction.publicKey);
        const [settings] = await this.getSettingsPDA();
        const [opsAccount] = await this.getOpsPDA();

        // Create the SOL transfer instruction
        const transferIx = SystemProgram.transfer({
            fromPubkey: multisigSigner,
            toPubkey: destination,
            lamports: amount * LAMPORTS_PER_SOL
        });

        // Convert the transfer instruction into the format expected by the multisig
        const txAccounts = transferIx.keys.map(key => ({
            pubkey: key.pubkey,
            isSigner: key.isSigner,
            isWritable: key.isWritable
        }));

        const pdaTimestamp = Math.floor(Date.now() / 1000);
        const [pdaAccount, pdaBump] = await PublicKey.findProgramAddress(
            [Buffer.from(pdaTimestamp.toString())],
            this.program.programId
        );

        const tx = await this.program.methods
            .createTransaction(
                transferIx.programId,
                txAccounts,
                transferIx.data,
                0, // operation
                title,
                description,
                new BN(expirationDate),
                new BN(pdaTimestamp),
                pdaBump
            )
            .accounts({
                multisig,
                transaction: transaction.publicKey,
                transactionDetail,
                proposer: this.program.provider.publicKey,
                opsAccount,
                settings,
                systemProgram: SystemProgram.programId
            })
            .signers([transaction])
            .rpc();

        return tx;
    }

    async approveTransaction(
        multisig: PublicKey,
        transaction: PublicKey
    ): Promise<string> {
        const [transactionDetail] = await this.getTransactionDetailPDA(transaction);

        return await this.program.methods
            .approve()
            .accounts({
                multisig,
                transaction,
                transactionDetail,
                owner: this.program.provider.publicKey,
                systemProgram: SystemProgram.programId
            })
            .rpc();
    }

    async executeTransaction(
        multisig: PublicKey,
        transaction: PublicKey
    ): Promise<string> {
        const [multisigSigner] = await this.getMultisigSignerPDA(multisig);
        const [transactionDetail] = await this.getTransactionDetailPDA(transaction);

        return await this.program.methods
            .executeTransaction()
            .accounts({
                multisig,
                multisigSigner,
                transaction,
                transactionDetail,
                payer: this.program.provider.publicKey,
                systemProgram: SystemProgram.programId
            })
            .rpc();
    }
}