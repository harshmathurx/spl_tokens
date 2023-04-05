import {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
} from "@solana/web3.js";
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    transfer,
} from "@solana/spl-token";

(async () => {
    // Step 1: Connect to cluster and generate two new Keypairs
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const symbol = "BLB";

    const fromWallet = Keypair.fromSecretKey(
        bs58.decode(
            "5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG"
        )
    );
    console.log(fromWallet.publicKey.toBase58());
    console.log(fromWallet.secretKey);

    const toWallet = Keypair.generate();
    console.log(toWallet.publicKey.toBase58());
    console.log(toWallet.secretKey);

    // Step 3: Create new token mint and get the token account of the fromWallet address
    //If the token account does not exist, create it
    const mint = await createMint(
        connection,
        fromWallet,
        fromWallet.publicKey,
        null,
        9
    );
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    );

    //Step 4: Mint a new token to the from account
    let signature = await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        8000000000,
        []
    );
    console.log("mint tx:", signature);

    //Step 5: Get the token account of the to-wallet address and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        toWallet.publicKey
    );

    console.log("to tokan account created");

    //Step 6: Transfer the new token to the to-wallet's token account that was just created
    // Transfer the new token to the "toTokenAccount" we just created
    signature = await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        4000000000,
        []
    );
    console.log("transfer tx:", signature);
})();
