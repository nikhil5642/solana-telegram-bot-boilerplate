import dotenv from 'dotenv';
dotenv.config();
import { bot } from './src/bot/bot.js'
import express from 'express';

console.log('Bot has been initialized and is running...');

// Optional: Set up a basic Express server if needed
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World! The Telegram bot is running.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});