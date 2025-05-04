# Background and Motivation
We need to scaffold **CreatorTip**, a Web3 tipping micro-app on Lens Protocol targeting deployment on Polygon. The app lets users tip Lens creators in MATIC or BONSAI via Lens Open Actions and rewards tippers with a Supporter NFT.

# Key Challenges and Analysis
- Monorepo scaffolding for frontend, backend, and smart contracts
- Integrating Lens Protocol SDKs securely on client and server
- Smart contract design: token transfers + NFT minting + access control
- Efficient off-chain data flows using Momoka to minimize gas
- Wallet connection and Lens authentication flows
- Environment variable management for RPC, IPFS, API keys, private keys
- Keeping UI minimal and functionality-focused

# High-level Task Breakdown
1. Initialize monorepo structure with Next.js frontend, Express backend, and Hardhat contracts
2. Scaffold frontend: Next.js (TypeScript), Tailwind CSS, Shadcn/UI, wagmi & RainbowKit
3. Implement landing page (wallet connect + Sign in with Lens)
4. Implement tip page scaffold with amount input and Tip button
5. Implement dashboard page scaffold (display total tips + NFT holders)
6. Scaffold backend: Express server with Open Action and analytics endpoints
7. Integrate @lens-protocol/node SDK in server routes
8. Configure contracts: Hardhat setup and contracts folder
9. Create `CreatorTip.sol` with `tip` and `mintSupporterNFT` functions
10. Write Hardhat deploy script for Polygon Mumbai
11. Setup environment variables placeholders (`.env.local`)
12. Create `README.md` with setup instructions and sample workflow

# Project Status Board
- [ ] Initialize monorepo structure
- [ ] Scaffold frontend with TS, Tailwind, Shadcn/UI, wagmi & RainbowKit
- [ ] Implement landing page (connect + Lens auth)
- [ ] Implement tip page scaffold
- [ ] Implement dashboard page scaffold
- [ ] Scaffold Express server
- [ ] Add Open Action API endpoint
- [ ] Add tips analytics API endpoint
- [ ] Integrate Lens Node SDK in server
- [ ] Configure Hardhat and contracts folder
- [ ] Create `CreatorTip.sol` contract
- [ ] Write deploy script
- [ ] Setup env variables
- [ ] Create `README.md`

# Executor's Feedback or Assistance Requests

# Lessons 