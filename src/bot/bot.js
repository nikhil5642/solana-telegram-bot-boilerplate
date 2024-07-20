import dotenv from 'dotenv';
dotenv.config();
import { createWallet, loadWallet, createPhantomTransactionRequest, generatePhantomSignatureURL } from "../wallet/wallet.js"
import TelegramBot from 'node-telegram-bot-api';


const token = process.env.TELEGRAM_BOT_TOKEN;

export const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const welcomeMessage = `
Welcome to the Solana Telegram Bot! 🌟
This bot allows you to securely manage a Solana wallet and interact with transactions directly from Telegram.

🔹 Use /createwallet to create a new Solana wallet for your Telegram ID if one does not already exist.
🔹 Use /loadwallet loads your existing Solana wallet and displays the public key.
🔹 Use /sign_transaction [recipient] [amount] to prepare a transaction to your loaded wallet.
🔹 Use /sign_message [message] to sign a provided message using the secret key of your loaded wallet.
🔹 Use /sign_transaction_phantom [recipient] [amount] to prepare a transaction to your Phantom wallet.
🔹 Use /sign_message_phantom [message] to generate a signature request for your Phantom wallet.

Start by creating or loading your wallet, and try sending or signing a transaction!
    `;
    bot.sendMessage(msg.chat.id, welcomeMessage);
});

bot.onText(/\/createwallet/, (msg) => {
    createWallet(msg.from.id.toString(), (err, response) => {
        if (err) {
            bot.sendMessage(msg.chat.id, `Failed to create wallet: ${err.message}`);
        } else if (response.includes("A wallet already exists")) {
            bot.sendMessage(msg.chat.id, response);
        } else {
            bot.sendMessage(msg.chat.id, `New wallet created! Public Key: ${response}`);
        }
    });
});


bot.onText(/\/loadwallet/, (msg) => {
    loadWallet(msg.from.id.toString(), (err, wallet) => {
        if (err) {
            bot.sendMessage(msg.chat.id, `Error: ${err}`);
        } else {
            bot.sendMessage(msg.chat.id, `Wallet loaded! Public Key: ${wallet.publicKey.toString()}`);
        }
    });
});


// Command to sign a message
bot.onText(/\/sign_message (.+)/, (msg, match) => {
    const message = match[1]; // Get the message from user input
    loadWallet(msg.from.id.toString(), (err, wallet) => {
        if (err) {
            bot.sendMessage(msg.chat.id, `Error: ${err}`);
        } else {
            const signature = wallet.sign(Buffer.from(message)).signature.toString('hex');
            bot.sendMessage(msg.chat.id, `Message signed. Signature: ${signature}`);
        }
    });
});


// Command to sign a transaction
bot.onText(/\/sign_transaction (.+)/, (msg, match) => {
    const [recipient, amount] = match[1].split(' ');
    loadWallet(msg.from.id.toString(), (err, wallet) => {
        if (err) {
            bot.sendMessage(msg.chat.id, `Error: ${err}`);
        } else {
            // Assuming you have a signTransaction function
            signTransaction(wallet, recipient, amount, (err, transaction) => {
                if (err) {
                    bot.sendMessage(msg.chat.id, `Transaction Error: ${err}`);
                } else {
                    bot.sendMessage(msg.chat.id, `Transaction signed successfully.`);
                }
            });
        }
    });
});

bot.onText(/\/sign_transaction_phantom (.+)/, (msg, match) => {
    const [recipient, amount] = match[1].split(' ');
    // Assuming createTransactionRequest returns a URL or QR code
    const transactionLink = createPhantomTransactionRequest(msg.from.id, recipient, amount);
    bot.sendMessage(msg.chat.id, `Please sign the transaction using this link: ${transactionLink}`);
});

bot.onText(/\/sign_message_phantom (.+)/, (msg, match) => {
    const message = match[1]; // Get the message from user input
    const signUrl = generatePhantomSignatureURL(message);
    bot.sendMessage(msg.chat.id, `Please click on the following link to sign the message with your Phantom wallet: ${signUrl}`);
});
