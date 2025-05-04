# CreatorTip

A Web3 tipping micro-app built on Lens Protocol and deployed to Polygon.

## Project Structure

```
.
├── contracts/           # Solidity contracts & Hardhat config
│   ├── contracts/       # Solidity source files
│   ├── scripts/         # Deployment scripts
│   └── hardhat.config.ts
├── frontend/            # Next.js TypeScript frontend
├── server/              # Express backend for Open Actions & analytics
├── .env.example         # Example environment variables
├── .env.local           # Local env file (ignored)
└── README.md            # Project overview and setup
```

## Prerequisites

- Node.js >= 18
- npm
- A wallet private key (for deployments)
- RPC URL for Polygon Mumbai (Alchemy/Infura)
- IPFS API endpoint (e.g., Infura)
- Lens Protocol API key (if required)

## Setup

1. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required values in `.env.local`.

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
   npm run deploy
   ```
   The deployed address will be printed to the console.

4. Update Open Action address:
   - Copy the deployed contract address into `OPEN_ACTION_ADDRESS` in `.env.local`.

5. Start the backend:
   ```bash
   cd server
   npm run start  # or `npm run dev` once implemented
   ```

6. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Next Steps & TODOs

- Implement frontend pages:
  - Landing page (`pages/index.tsx`) for wallet connect & Lens auth.
  - Tip page (`pages/tip/[postId].tsx`) with tip form (MATIC/BONSAI).
  - Dashboard page (`pages/dashboard.tsx`) showing tips & NFT holders.
- Scaffold Express API routes:
  - `/api/open-action` for Lens Open Action tipping.
  - `/api/tips` for analytics.
- Integrate `@lens-protocol/client` on the server.
- Enhance smart contract for metadata storage on IPFS.
- Write tests for contracts and backend.

## License

MIT 