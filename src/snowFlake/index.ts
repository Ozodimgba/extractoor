import { AnchorProvider, Program, Provider } from "@project-serum/anchor";
import { SnowflakeSafe, DEFAULT_FLOW_SIZE } from "@snowflake-so/safe-sdk";
import { clusterApiUrl, Connection, PublicKey, TransactionInstruction, TransactionSignature } from "@solana/web3.js";

export class SnowFlakeSDK {
    public sdk: SnowflakeSafe;
    public connection: Connection;

    constructor(provider?: AnchorProvider) {
        this.sdk = new SnowflakeSafe(provider)
        this.connection = new Connection(clusterApiUrl('devnet'));
    }

    async createSafe(owner: PublicKey): Promise<[PublicKey, TransactionSignature]> {
        const input = {
            approvalsRequired: 1,
            owners: [owner],
          };
          const [newSafeAddress, txId] = await this.sdk.createSafe(
           input.owners,
           input.approvalsRequired
          )

          return [newSafeAddress, txId]
    }

    async createProposal(safeAddress: PublicKey, ix: TransactionInstruction[]) {
       const [ proposalAddress ] = await this.sdk.createProposal(safeAddress, 'JTO', ix, [], DEFAULT_FLOW_SIZE, true);

       return proposalAddress
    }

    async approveProposal(proposalAddress: PublicKey) {
        await this.sdk.approveProposal(proposalAddress)
    }

    async executeProposal(proposalAddress: PublicKey) {
        await this.sdk.executeProposal(proposalAddress)
    }
}