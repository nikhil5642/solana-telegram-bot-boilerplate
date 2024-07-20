import { Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import sqlite3 from 'sqlite3'
import { encrypt,decrypt } from './cryptoUtils.js';

const db = new sqlite3.Database('./userWallets.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS wallets (userId TEXT PRIMARY KEY, encryptedKey TEXT)");
});

// Function to create a new Solana wallet only if none exists and save it securely
export function createWallet(userId, callback) {
    // Check if a wallet already exists for this user
    db.get('SELECT encryptedKey FROM wallets WHERE userId = ?', [userId], (err, row) => {
        if (err) {
            return callback(err, null);
        }
        if (row) {
            return callback(null, "A wallet already exists for this user.");
        } else {
            // Create a new wallet since none exists
            const keypair = Keypair.generate();
            const encryptedKey = encrypt(JSON.stringify(Array.from(keypair.secretKey)));
            
            db.run('INSERT INTO wallets (userId, encryptedKey) VALUES (?, ?)', [userId, JSON.stringify(encryptedKey)], function(err) {
                if (err) {
                    return callback(err, null);
                }
                console.log(`A new wallet has been created for user: ${userId}`);
                callback(null, keypair.publicKey.toString());
            });
        }
    });
}


// Function to load an existing Solana wallet from secure storage
export function loadWallet(userId,callback) {
    db.get('SELECT encryptedKey FROM wallets WHERE userId = ?', [userId], (err, row) => {
        if (err) {
            return callback(err, null);
        }
        if (row) {
            const decryptedKey = decrypt(JSON.parse(row.encryptedKey));
            const keypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(decryptedKey)));
            return callback(null, keypair);
        } else {
            console.log('No wallet found for this user.');
            return callback('No wallet found', null);
        }
    });
}


// Function to sign a message using a user's wallet
async function signMessage(userId, message) {
    try {
        const userKeypair = loadWallet(userId);
        if (!userKeypair) {
            return { error: 'No wallet found. Please create one first.' };
        }
        // Assuming the message is a simple string that needs to be signed
        const signature = userKeypair.sign(Buffer.from(message)).signature;
        return { signature: signature.toString('hex') };
    } catch (error) {
        return { error: error.message };
    }
}

// Function to sign a transaction using a user's wallet
async function signTransaction(userId, recipient, amount) {
    try {
        const userKeypair = loadWallet(userId);
        if (!userKeypair) {
            return { error: 'No wallet found. Please create one first.' };
        }
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: userKeypair.publicKey,
                toPubkey: recipient,
                lamports: amount * LAMPORTS_PER_SOL
            })
        );
        transaction.sign(userKeypair);  // Sign the transaction
        return { transaction: transaction };
    } catch (error) {
        return { error: error.message };
    }
}



export function createPhantomTransactionRequest(userId, recipient, amount) {
    const cluster = 'mainnet-beta'; // or 'devnet', 'testnet' depending on your environment
    const encodedRecipient = encodeURIComponent(recipient);
    const encodedAmount = encodeURIComponent(amount);
    
    // Create the deep link URL for Phantom to sign a transaction
    return `https://phantom.app/ul/signTransaction?cluster=${cluster}&recipient=${encodedRecipient}&amount=${encodedAmount}`;
}



export function generatePhantomSignatureURL(message) {
    // Encode the message in base64 format
    const encodedMessage = Buffer.from(message).toString('base64');
    
    // Generate the deep link URL for Phantom to sign a message
    return `https://phantom.app/ul/signMessage?message=${encodedMessage}`;
}
