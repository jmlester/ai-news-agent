const BaseNewsProvider = require('./baseProvider');

class NewsApiProvider extends BaseNewsProvider {
  constructor(apiKey, logger) {
    super('newsapi');
    this.apiKey = apiKey;
    this.logger = logger;
  }

  get enabled() {
    return Boolean(this.apiKey);
  }

  async fetchArticles({ topic, limit }) {
    if (!this.enabled) return [];
    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.set('q', topic);
    url.searchParams.set('language', 'en');
    url.searchParams.set('sortBy', 'publishedAt');
    url.searchParams.set('pageSize', Math.min(limit, 100));

    try {
      const response = await fetch(url.toString(), {
        headers: { 'X-Api-Key': this.apiKey },
      });

      if (!response.ok) {
        this.logger.warn('NewsAPI returned non-200', { status: response.status });
        return [];
      }

      const data = await response.json();
      return (data.articles || []).map((article) => ({
        title: article.title,
        description: article.description,
        source: article.source?.name || this.name,
        url: article.url,
        publishedAt: article.publishedAt,
      }));
    } catch (error) {
      this.logger.error('Failed to fetch from NewsAPI', { error: error.message });
      return [];
    }
  }
}

module.exports = NewsApiProvider;
