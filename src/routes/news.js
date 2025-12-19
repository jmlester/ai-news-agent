const express = require('express');
const config = require('../config/env');

const router = express.Router();

module.exports = (aggregator) => {
  router.get('/', async (req, res, next) => {
    const topic = req.query.topic?.trim() || config.defaultTopic;
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 50);
    const summarizeParam = req.query.summarize;
    const summarize =
      summarizeParam === undefined ? config.summarizeByDefault : summarizeParam.toLowerCase() !== 'false';

    try {
      const payload = await aggregator.getArticles({ topic, limit, summarize });
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
