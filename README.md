# Solana Telegram Bot BoilerPlate

This repository contains a boilerplate for a Telegram bot designed to manage Solana wallets and perform blockchain operations like sending transactions and signing messages directly through Telegram.

## Features

- **Wallet Management**: Create and load Solana wallets.
- **Message Signing**: Sign arbitrary messages using a Solana wallet.
- **Transaction Handling**: Prepare and sign transactions.
- **Phantom Wallet Integration**: Utilize Phantom deep links for transactions and signing.
- **Secure Storage**: Encrypt and store wallet keys securely.

## Prerequisites

- Node.js (v14.x or later)
- npm or yarn
- A Telegram Bot Token (obtained from [BotFather](https://t.me/botfather))
- SQLite for database operations

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nikhil5642/solana-telegram-bot-boilerplate.git
   cd solana-telegram-bot-boilerplate
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the project root and add the following:
   ```
   TELEGRAM_BOT_TOKEN='your_telegram_bot_token_here'
   ENCRYPTION_KEY='your_secret_encryption_key_here'
   PORT='your_server_port'
   ```

4. **Initialize the database** (if needed):
   Ensure that the SQLite database is set up by running any initialization scripts included.

## Usage

To start the bot, run:

```bash
node index.js
```

Interact with the bot using the following commands in Telegram:

- `/start`: Initializes the bot and lists available commands.
- `/createwallet`: Creates a new Solana wallet.
- `/loadwallet`: Loads an existing wallet.
- `/sign_transaction [recipient] [amount]`: Prepares a transaction to your loaded wallet.
- `/sign_message [message]`: Sign a provided message using the secret key of your loaded wallet.
- `/sign_transaction_phantom [recipient] [amount]`: Prepare a transaction request to your Phantom wallet.
- `/sign_message_phantom [message]`: Generate a signature request for your Phantom wallet.


## Contributing

Contributions are welcome! Please fork the repository and submit pull requests with any enhancements, bug fixes, or improvements.

## License

This project is released under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

If you need assistance or have any questions, feel free to raise an issue on the GitHub repository or contact nikhilagrawal5642@gmail.com.
