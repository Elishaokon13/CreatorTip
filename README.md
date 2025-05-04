# CreatorTip

A Web3 tipping micro-app built on Lens Protocol and deployed to Lens Chain Testnet.

## Project Structure

```
.
├── contracts/           # Solidity contracts & Hardhat config
│   ├── contracts/       # Solidity source files
│   ├── scripts/         # Deployment scripts
│   └── hardhat.config.ts
├── frontend/            # Next.js TypeScript frontend (Lens Testnet chain config)
├── server/              # Express backend for Open Actions & analytics
├── .env.example         # Example environment variables
├── .env.local           # Local env file (ignored)
└── README.md            # Project overview and setup
```

## Lens Chain Testnet Details

- Network Name: Lens Chain Testnet
- Chain ID: 37111
- RPC URL: https://rpc.testnet.lens.xyz
- WebSocket URL: wss://rpc.testnet.lens.xyz/ws
- Currency Symbol: GRASS
- Block Explorer: https://explorer.testnet.lens.xyz

## Prerequisites

- Node.js >= 18
- npm
- Wallet private key with GRASS on Lens Testnet
- RPC URL for Lens Testnet
- IPFS API endpoint (e.g., Infura, Pinata)
- Lens Protocol API key (if required)

## Setup

1. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in required values in `.env.local`:
   - LENS_RPC_URL (e.g. https://rpc.testnet.lens.xyz)
   - POLYGON_RPC_URL (if also using Polygon)
   - WALLET_PRIVATE_KEY
   - OPEN_ACTION_ADDRESS (to be added after deploy)
   - CREATOR_TIP_CONTRACT_ADDRESS (to be added after deploy)
   - LENS_API_KEY
   - IPFS_API_URL
   - NEXT_PUBLIC_LENS_RPC_URL (same as LENS_RPC_URL)
   - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID (RainbowKit project ID)

2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd server && npm install
   cd contracts && npm install
   ```

3. Compile & deploy contracts:
   ```bash
   cd contracts
   npm run deploy:testnet
   ```
   Copy the deployed address printed in console and set `CREATOR_TIP_CONTRACT_ADDRESS` and `OPEN_ACTION_ADDRESS` in `.env.local`.

4. Start the backend:
   ```bash
   cd server
   npm run start
   ```

5. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Scripts

- `npm run deploy`          Deploy to Polygon Mumbai
- `npm run deploy:testnet`  Deploy to Lens Chain Testnet (37111)
- `npm run start`           Start Express API server
- `npm run dev`             Start Next.js frontend in development

## Next Steps & TODOs

- Finish UI flows:
  - Sign in with Lens (integrate Lens SDK hooks)
  - Tip page: finalize payment transaction details
  - Dashboard: polish stats layout; add filtering
- Enhance backend:
  - Secure Open Action endpoint
  - Persist analytics in a database
- Add NFT metadata pinning on IPFS
- Write tests for smart contract and API routes

## License

MIT 