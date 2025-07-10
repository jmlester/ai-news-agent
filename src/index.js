require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { composeUserContext } = require('./contextComposer');
const { generateAgentResponse } = require('./generateAgentResponse');
const fetch = require('node-fetch');

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

app.get('/news', async (req, res) => {
  console.log('✅ GET /news');
  try {
    const baseUrl = process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2/top-headlines';
    const url = `${baseUrl}?country=us&apiKey=${process.env.NEWS_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`News API error ${response.status}`);
    }
    const data = await response.json();
    const articles = data.articles || [];
    const mapped = articles.map(a => ({ title: a.title, summary: a.description }));
    res.json(mapped);
  } catch (err) {
    console.error('Error in /news route:', err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});