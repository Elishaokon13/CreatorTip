import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const openActionAddress = process.env.OPEN_ACTION_ADDRESS || "";
  console.log("Using Open Action Address:", openActionAddress);

  const CreatorTip = await ethers.getContractFactory("CreatorTip");
  const creatorTip = await CreatorTip.deploy(openActionAddress);
  await creatorTip.deployed();

  console.log("CreatorTip deployed to:", creatorTip.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 