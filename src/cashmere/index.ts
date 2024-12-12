// import { BN, Program, Provider } from "@coral-xyz/anchor";
import { BN, Program, Provider } from "@project-serum/anchor"
import { Cashmere, IDL } from "./IDL";
import { Connection, Keypair, PublicKey, SystemProgram, TransactionInstruction, TransactionSignature } from "@solana/web3.js";

type CreateMultisigArgs = {
    owners: PublicKey[];
    maxOwners: number;
    threshold: number;
    nonce: number;
  }


export class CashmereSDK {
    public program: Program<Cashmere>;
    public connection: Connection;

    constructor(provider?: Provider) {
        this.program = new Program<Cashmere>(IDL as Cashmere, new PublicKey('4wcedASdm3sDGirPGBjYsEjSGcLzFWM5fa4EY8RK6KHg'), provider);
        this.connection = this.program.provider.connection;
    }

    async createMultisig(
        multisig: Keypair,
        maxOwners: number,
        owners: PublicKey[],
        threshold: number,
        nonce: number,
        payer: Keypair
      ): Promise<TransactionSignature> {
        return await this.program.methods
          .createMultisig(maxOwners, owners, new BN(threshold), nonce)
          .accounts({
            multisig: multisig.publicKey,
            payer: payer.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([multisig])
          .rpc();
      }

      async createProposal(
        multisig: PublicKey,
        proposal: Keypair,
        proposer: PublicKey,
      ): Promise<TransactionSignature> {
        return await this.program.methods
          .createProposal()
          .accounts({
            multisig,
            proposal: proposal.publicKey,
            proposer,
            systemProgram: SystemProgram.programId,
          })
          .signers([proposal])
          .rpc();
      }

      async appendProposalIx(
        multisig: PublicKey,
        proposal: PublicKey,
        proposalIx: PublicKey,
        proposer: PublicKey,
        instruction: TransactionInstruction,
        bump: number,
        batchNum: number
      ): Promise<TransactionSignature> {
        const ix = {
          programId: instruction.programId,
          data: instruction.data,
          accounts: instruction.keys.map(key => ({
            pubkey: key.pubkey,
            isSigner: key.isSigner,
            isWritable: key.isWritable,
          })),
        };
    
        return await this.program.methods
          .appendProposalIx(
            ix,
            bump,
            batchNum
          )
          .accounts({
            multisig,
            proposal,
            proposalIx,
            proposer,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      }

      async approveProposal(
        multisig: PublicKey,
        proposal: PublicKey,
        owner: PublicKey
      ): Promise<TransactionSignature> {
        return await this.program.methods
          .approveProposal()
          .accounts({
            multisig,
            proposal,
            owner,
          })
          .rpc();
      }

      async executeProposalIx(
        multisig: PublicKey,
        multisigSigner: PublicKey,
        proposal: PublicKey,
        proposalIx: PublicKey,
        owner: PublicKey,
        index: number
      ): Promise<TransactionSignature> {
        return await this.program.methods
          .executeProposalIx(index)
          .accounts({
            multisig,
            multisigSigner,
            proposal,
            proposalIx,
            owner,
          })
          .rpc();
      } 

     // Helper: Get PDA for proposal instruction
    async getProposalIxPDA(
     proposal: PublicKey,
     index: number
    ): Promise<[PublicKey, number]> {
       return PublicKey.findProgramAddress(
        [
          proposal.toBuffer(),
          Buffer.from("proposal-ix"),
          Buffer.from(new Uint8Array([index])),
        ],
        this.program.programId
      );
    }

    // Helper: Get multisig signer PDA
  async getMultisigSignerPDA(
    multisig: PublicKey
  ): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddress(
      [multisig.toBuffer()],
      this.program.programId
    );
  }
}