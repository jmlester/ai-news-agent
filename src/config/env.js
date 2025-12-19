const dotenv = require('dotenv');

// Load environment variables from .env when present
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  defaultTopic: process.env.DEFAULT_TOPIC || 'ai incidents',
  summarizeByDefault: (process.env.SUMMARIZE_BY_DEFAULT || 'true').toLowerCase() === 'true',
  cacheTtlMs: parseInt(process.env.CACHE_TTL_MS || `${5 * 60 * 1000}`, 10),
  newsApiKey: process.env.NEWSAPI_KEY,
  openAiKey: process.env.OPENAI_API_KEY,
};

module.exports = config;
