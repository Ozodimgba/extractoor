import { BN, Program, Provider } from "@project-serum/anchor";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { MeanMultisig, IDL } from "./IDL/mf";

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
    

    constructor(provider?: Provider) {
        this.program = new Program<MeanMultisig>(IDL as MeanMultisig, MEAN_MULTISIG_PROGRAM, provider);
        this.connection = this.program.provider.connection;
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