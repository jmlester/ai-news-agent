const crypto = require('node:crypto');

class NewsAggregator {
  constructor({ providers = [], summarizer, cache, logger }) {
    this.providers = providers;
    this.summarizer = summarizer;
    this.cache = cache;
    this.logger = logger;
  }

  buildCacheKey(topic, limit, summarize) {
    return crypto
      .createHash('sha1')
      .update(`${topic}-${limit}-${summarize}`)
      .digest('hex');
  }

  deduplicate(articles) {
    const seen = new Set();
    return articles.filter((article) => {
      const key = article.url || article.title;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  sortByDate(articles) {
    return [...articles].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }

  async summarizeArticles(articles, summarize) {
    if (!summarize) return articles;
    const summarized = [];
    for (const article of articles) {
      const text = article.description || article.title;
      const summary = await this.summarizer.summarize(text);
      summarized.push({ ...article, summary });
    }
    return summarized;
  }

  async getArticles({ topic, limit = 20, summarize = false }) {
    const cacheKey = this.buildCacheKey(topic, limit, summarize);
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const providerPromises = this.providers.map((provider) =>
      provider
        .fetchArticles({ topic, limit })
        .then((articles) => ({ status: 'fulfilled', articles }))
        .catch((error) => ({ status: 'rejected', error })),
    );

    const results = await Promise.all(providerPromises);

    const combined = results
      .flatMap((result, index) => {
        if (result.status === 'rejected') {
          this.logger.warn('Provider failed', { provider: this.providers[index].name, error: result.error?.message });
          return [];
        }
        return result.articles;
      })
      .filter(Boolean);

    const deduped = this.deduplicate(combined);
    const sorted = this.sortByDate(deduped).slice(0, limit);
    const finalArticles = await this.summarizeArticles(sorted, summarize);

    const payload = { topic, count: finalArticles.length, articles: finalArticles };
    this.cache.set(cacheKey, payload);
    return payload;
  }
}

module.exports = NewsAggregator;
