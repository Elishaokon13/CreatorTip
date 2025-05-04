import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from the project root .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function main() {
  const openActionAddress = process.env.OPEN_ACTION_ADDRESS || "";
  console.log("Using Open Action Address:", openActionAddress);
  // Validate Open Action address
  if (!ethers.utils.isAddress(openActionAddress)) {
    throw new Error("Invalid OPEN_ACTION_ADDRESS in .env.local");
  }
  // Log network info
  const network = await ethers.provider.getNetwork();
  console.log(`Deploying to network ${network.name} (chainId: ${network.chainId})`);
  // Parse initial supported tokens list (comma-separated)
  const initialTokensEnv = process.env.INITIAL_SUPPORTED_TOKENS || "";
  const initialTokens = initialTokensEnv
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  console.log("Using initial supported tokens:", initialTokens);
  // Validate initial supported token addresses
  initialTokens.forEach((addr) => {
    if (!ethers.utils.isAddress(addr)) {
      throw new Error(`Invalid token address in INITIAL_SUPPORTED_TOKENS: ${addr}`);
    }
  });

  const CreatorTip = await ethers.getContractFactory("CreatorTip");
  // Deploy with OpenAction address and initial token whitelist
  const creatorTip = await CreatorTip.deploy(openActionAddress, initialTokens);
  await creatorTip.deployed();

  console.log("CreatorTip deployed to:", creatorTip.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 