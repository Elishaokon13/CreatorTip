const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const openActionRouter = require('./routes/open-action');
const tipsRouter = require('./routes/tips');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/open-action', openActionRouter);
app.use('/api/tips', tipsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 