const express = require('express');
const router = express.Router();
const { LensClient } = require('@lens-protocol/client');

// Configure Lens client (TODO: set environment and credentials)
const lensClient = new LensClient({
  // Example: environment: 'development',
});

router.post('/', async (req, res) => {
  const { postId: publicationId, amount: tipAmount, token: tipToken } = req.body;
  try {
    // Integrate Lens Open Action logic
    // For example, use tip action from LensClient
    const result = await lensClient.openActions.tip({
      postId: publicationId,
      amount: tipAmount,
      token: tipToken,
    });
    // result.txHash contains the transaction hash
    const txHash = result.txHash;
    return res.json({ txHash });
  } catch (error) {
    console.error('Open Action error:', error);
    res.status(500).json({ error: 'Open Action failed' });
  }
});

module.exports = router; 