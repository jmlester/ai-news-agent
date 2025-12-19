const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const logger = require('./logger');
const NewsAggregator = require('./services/aggregator');
const Summarizer = require('./services/summarizer');
const InMemoryCache = require('./services/cache');
const NewsApiProvider = require('./services/providers/newsApiProvider');
const SampleProvider = require('./services/providers/sampleProvider');
const healthRouter = require('./routes/health');
const newsRouterFactory = require('./routes/news');

const buildApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const cache = new InMemoryCache(config.cacheTtlMs);
  const summarizer = new Summarizer(config.openAiKey, logger);
  const providers = [new NewsApiProvider(config.newsApiKey, logger), new SampleProvider()];
  const aggregator = new NewsAggregator({ providers, summarizer, cache, logger });

  app.use('/health', healthRouter);
  app.use('/news', newsRouterFactory(aggregator));

  app.use((err, _req, res, _next) => {
    logger.error('Unhandled error', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
};

module.exports = buildApp;
