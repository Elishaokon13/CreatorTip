const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();

const router = express.Router();

// Load contract ABI and setup provider
const contractArtifact = require('../../contracts/artifacts/contracts/CreatorTip.sol/CreatorTip.json');
const contractABI = contractArtifact.abi;
const rpcUrl = process.env.LENS_RPC_URL;
const contractAddress = process.env.CREATOR_TIP_CONTRACT_ADDRESS;
if (!rpcUrl || !contractAddress) {
  throw new Error('Missing POLYGON_RPC_URL or CREATOR_TIP_CONTRACT_ADDRESS in environment');
}
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// GET /api/tips - returns tip analytics for dashboard
router.get('/', async (req, res) => {
  try {
    // Fetch all Tipped events
    const tippedEvents = await contract.queryFilter(contract.filters.Tipped());
    let total = ethers.BigNumber.from(0);
    const tipMap = {};
    tippedEvents.forEach(evt => {
      const tipper = evt.args.tipper;
      const amount = evt.args.amount;
      total = total.add(amount);
      tipMap[tipper] = (tipMap[tipper] || ethers.BigNumber.from(0)).add(amount);
    });

    // Fetch all SupporterNFTMinted events
    const nftEvents = await contract.queryFilter(contract.filters.SupporterNFTMinted());
    const supporters = nftEvents.map(evt => ({
      address: evt.args.tipper,
      tokenId: evt.args.tokenId.toString(),
      metadataURI: evt.args.tokenURI
    }));

    // Build top tippers sorted by amount
    const topTippers = Object.entries(tipMap)
      .map(([address, amt]) => ({ address, amt }))
      .sort((a, b) => b.amt.sub(a.amt).toNumber())
      .slice(0, 10)
      .map(({ address, amt }) => ({
        address,
        amount: ethers.utils.formatEther(amt)
      }));

    return res.json({
      totalTips: ethers.utils.formatEther(total),
      topTippers,
      supporters
    });
  } catch (error) {
    console.error('Tips analytics error:', error);
    return res.status(500).json({ error: 'Failed to fetch tips analytics' });
  }
});

module.exports = router; 