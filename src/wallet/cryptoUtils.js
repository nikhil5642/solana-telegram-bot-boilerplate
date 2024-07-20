import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const secretKey = process.env.ENCRYPTION_KEY; // Ensure you have this in your .env file
const iv = crypto.randomBytes(16);

export function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
}

export function decrypt(hash) {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrypted.toString();
}