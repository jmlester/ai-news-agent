const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const NewsAggregator = require('../src/services/aggregator');
const InMemoryCache = require('../src/services/cache');
const BaseProvider = require('../src/services/providers/baseProvider');

class MockProvider extends BaseProvider {
  constructor(name, articles) {
    super(name);
    this.articles = articles;
    this.calls = 0;
  }

  async fetchArticles() {
    this.calls += 1;
    return this.articles;
  }
}

class MockSummarizer {
  constructor() {
    this.calls = 0;
  }
  async summarize(text) {
    this.calls += 1;
    return `summary: ${text.slice(0, 10)}`;
  }
}

describe('NewsAggregator', () => {
  let aggregator;
  let providerA;
  let providerB;
  let summarizer;
  let cache;

  beforeEach(() => {
    providerA = new MockProvider('a', [
      { title: 'Same title', url: 'https://a.com', publishedAt: '2024-01-01', description: 'desc a' },
    ]);
    providerB = new MockProvider('b', [
      { title: 'Same title', url: 'https://a.com', publishedAt: '2024-01-02', description: 'desc b' },
      { title: 'Unique', url: 'https://b.com', publishedAt: '2024-01-03', description: 'desc c' },
    ]);
    summarizer = new MockSummarizer();
    cache = new InMemoryCache(5000);
    aggregator = new NewsAggregator({ providers: [providerA, providerB], summarizer, cache, logger: console });
  });

  it('deduplicates by URL and sorts by recency', async () => {
    const result = await aggregator.getArticles({ topic: 'ai', limit: 10, summarize: false });
    assert.strictEqual(result.count, 2);
    assert.strictEqual(result.articles[0].url, 'https://b.com');
    assert.strictEqual(result.articles[1].url, 'https://a.com');
  });

  it('summarizes when enabled', async () => {
    const result = await aggregator.getArticles({ topic: 'ai', limit: 10, summarize: true });
    assert.strictEqual(summarizer.calls, 2);
    assert.ok(result.articles.every((article) => article.summary));
  });

  it('caches responses', async () => {
    await aggregator.getArticles({ topic: 'ai', limit: 10, summarize: false });
    await aggregator.getArticles({ topic: 'ai', limit: 10, summarize: false });
    assert.strictEqual(providerA.calls, 1);
    assert.strictEqual(providerB.calls, 1);
  });
});
