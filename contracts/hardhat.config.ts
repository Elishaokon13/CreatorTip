import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from root .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    polygonMumbai: {
      url: process.env.POLYGON_RPC_URL || "",
      accounts: process.env.WALLET_PRIVATE_KEY ? [process.env.WALLET_PRIVATE_KEY] : []
    },
    baseGoerli: {
      url: process.env.BASE_RPC_URL || "https://goerli.base.org",
      chainId: 84532,
      accounts: process.env.WALLET_PRIVATE_KEY ? [process.env.WALLET_PRIVATE_KEY] : []
    },
    lensTestnet: {
      url: process.env.LENS_RPC_URL || "https://rpc.testnet.lens.xyz",
      chainId: 37111,
      accounts: process.env.WALLET_PRIVATE_KEY ? [process.env.WALLET_PRIVATE_KEY] : []
    }
  }
};

export default config; 