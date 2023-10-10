
# Telegram Marketplace (Miniapp contest)

This project aims to create a versatile and user-friendly marketplace and store creation platform. With this platform, users will be able to easily set up their own online stores and marketplaces, allowing them to sell products or services to a wide range of customers.

## Key Features

🏪 **Store Creation**: Users can effortlessly create their own online stores by following a simple setup process. They can add product categories. *WIP: customize their store's appearance, and set up payment methods.*

🛒 **Product Management**: Store owners can easily manage their product inventory, including adding new products, updating existing ones, and tracking stock levels. They can also set pricing. *WIP: discounts and manage product variants.*

📈 **Order Management**: The platform provides a comprehensive order management system, allowing store owners to view and process orders. *WIP: Handle returns and refunds, and track shipping status.*

🔎 **Search and Filtering** (filtering WIP): Customers can easily search for products across all stores on the platform. Advanced filtering options enable them to refine their search based on price, category, brand, and more. 

🔒 **Secure Payment Integration (WIP)**: The platform integrates with popular payment gateways, ensuring secure and seamless transactions for both store owners and customers. Multiple payment options are supported, including credit cards, digital wallets, and more.

⭐ **User Reviews and Ratings (WIP)**: Customers can leave reviews and ratings for products and stores, helping other users make informed purchasing decisions. Store owners can respond to reviews and engage with their customers.


## Tech Stack

**Client:** Vite, SolidJS, Typescript, TailwindCSS  
**Server:** Golang, Pocketbase  
**Database:** SQLite in WAL mode (Pocketbase implemented)

## Getting Started
### Requirements:
 - [Node](https://nodejs.org/ru)
 - [PNPM](https://pnpm.io/installation)
 - [GoLang](https://go.dev/doc/install)


### Steps:

#### Create bots

Because in this project at least two bots should be used, one for market and one for dashboard, these steps should be followed two times:
   1. Search for [@BotFather](https://t.me/BotFather) on Telegram.
   2. Start a chat with BotFather.
   3. Use the `/newbot` command to create a new bot.
   4. Following the instructions, choose a bot name and get a Bot Token.
   5. Enter and execute the /setmenubutton command.
   6. Select the new bot.
   7. Set the application URL. For dashboard bot the url should be `<URL>/dashboard`, for market - `<URL>/market` (`127.0.0.1:4321` for `<URL>` if it is local development, or replace it with the URL of your deployed bot).
   8. Set title of the menu button.

The provided bot tokens will be used in the `.env` file, see **Step 4** of [Start and application](#start-an-application)

#### Start an application

1. Install dependencies with pnpm
    ```bash 
    pnpm  install --frozen-lockfile 
    ```
2. Create bot for market and store
2. (Local development only) Run webhook proxy server. **[ngrok](https://ngrok.com/download) required.**
    ```bash
    pnpm  ngrok
    ```  
3. Fill the `.env` file with values. Command to create the file:
    ```bash
    cp .env.example .env
    ```
    **PUBLIC_POCKETBASE_URL** should be `127.0.0.1:3000`. `TELEGRAM_STORE_BOT_TOKEN` and `TELEGRAM_MARKET_BOT_TOKEN` are filled with tokens from [@BotFather](https://t.me/BotFather) for both bots


4. Run backend, frontend and reverse proxy with one command.
    ```bash
    pnpm  dev
    ```
We use reverse proxy only in dev mode to exclude cors errors on the client.
Backend port: 8090
Frontend port: 4321
Reverse proxy port: 3000

## Deploy
There are ready to go docker files in the project.

Build the image and compose up the container
```bash
docker compose up --build
```

## Telegram settings

Use telegram test server for the developing purpose:
- @intgmarketbot for customers
- @intgstorebot for sellers