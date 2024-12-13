process.removeAllListeners('warning');
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { CashmereSDK } from "./cashmere";
import { MeanFinanceSDK } from "./meanFinance";
import { SnowFlakeSDK } from "./snowFlake";
import { AnchorProvider } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import * as mean from "@mean-dao/mean-multisig-sdk"
import bs58 from 'bs58';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    let wallet = new NodeWallet(Keypair.fromSecretKey(bs58.decode(process.env.PKEY || "")));

    let connection = new Connection(process.env.HELIUS_RPC_URL || "");
    const provider = new AnchorProvider(connection, wallet, {
        commitment: "finalized",
    });
    
    const sdk = new MeanFinanceSDK(provider, wallet);

    const multisig = Keypair.fromSecretKey(bs58.decode(process.env.PKEY || ""))


    console.log('Multi Sig ' + multisig.publicKey)

    const members = [{
        address: wallet.publicKey,
        name: 'FX' 
    }]; 
    try {
        const tx = await sdk.createMultisig(members, 1, 'Ms-1')
        console.log("Transaction signature:", tx);
    } catch (error) {
        console.error("Error:", error);
    }
}

// async function main() {
//     let wallet = new NodeWallet(Keypair.fromSecretKey(bs58.decode(process.env.PKEY || "")));

//     let connection = new Connection(process.env.HELIUS_RPC_URL || "");
//     const provider = new AnchorProvider(connection, wallet, {
//         commitment: "finalized",
//     });
    
//     const sdk = new MeanFinanceSDK(provider, wallet);

//     const multisig = Keypair.fromSecretKey(bs58.decode(process.env.PKEY || ""))


//     console.log('Multi Sig ' + multisig.publicKey)

//     const members = [{
//         address: wallet.publicKey,
//         name: 'FX' 
//     }]; 
//     try {
//         const tx = await sdk.createMultisig(members, 1, 'Ms-1')
//         console.log("Transaction signature:", tx);
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }

// async function main() {
//     let wallet = new NodeWallet(Keypair.fromSecretKey(bs58.decode(process.env.PKEY || "")));

//     let connection = new Connection(process.env.HELIUS_RPC_URL || "");
//     const provider = new AnchorProvider(connection, wallet, {
//         commitment: "finalized",
//     });
    
//     const sdk = new CashmereSDK(provider);

//     const multisig = Keypair.fromSecretKey(bs58.decode(process.env.PKEY || ""))

//     const [multisigPubkey, nonce] = await PublicKey.findProgramAddress(
//      [multisig.publicKey.toBuffer()],
//      sdk.program.programId
//     );


//     console.log('MS' + multisig.publicKey)


//     try {
//         const tx = await sdk.createMultisig(
//             multisig,
//             2, // maxOwners
//             [wallet.publicKey], // owners
//             1, // threshold
//             0, // nonce
//             wallet.payer // payer
//         );
//         console.log("Transaction signature:", tx);
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }

main().catch(console.error);