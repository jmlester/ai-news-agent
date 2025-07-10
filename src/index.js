require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { composeUserContext } = require('./contextComposer');
const { generateAgentResponse } = require('./generateAgentResponse');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.log('🧱 Express loaded');

app.get('/test-context', async (req, res) => {
  const { userId } = req.query;
  console.log(`✅ GET /test-context – userId: ${userId}`);
  try {
    const context = await composeUserContext(userId);
    res.json(context);
  } catch (err) {
    console.error('Error in /test-context route:', err);
    res.status(500).json({ error: 'Failed to compose context' });
  }
});

app.post('/generate-response', async (req, res) => {
  const { userId, prompt } = req.body;
  console.log(`✅ POST /generate-response – userId: ${userId}`);
  try {
    const context = await composeUserContext(userId);
    const { systemPrompt, response } = await generateAgentResponse(context, prompt);
    res.json({ systemPrompt, response });
  } catch (err) {
    console.error('Error in /generate-response route:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});