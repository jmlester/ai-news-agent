const BaseNewsProvider = require('./baseProvider');

class SampleProvider extends BaseNewsProvider {
  constructor() {
    super('sample');
  }

  async fetchArticles({ limit }) {
    const articles = [
      {
        title: 'AI chatbot misroutes emergency request during outage',
        description:
          'A municipal chatbot failed to forward emergency messages during a regional outage, prompting a temporary suspension of automated support.',
        source: 'City Desk',
        url: 'https://example.com/ai-chatbot-outage',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        title: 'Model hallucination triggers stock sell-off in simulated trading',
        description:
          'A backtest found a language model repeatedly fabricated regulatory notices, forcing a rollback of the trading experiment.',
        source: 'Quant Labs',
        url: 'https://example.com/model-hallucination-trading',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      },
      {
        title: 'AI voice assistant misidentifies medication dosage',
        description:
          'A consumer health assistant recommended incorrect dosage instructions before a guardrail update was applied.',
        source: 'Health Tech Review',
        url: 'https://example.com/voice-assistant-dosage',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
      {
        title: 'Content filter outage delays news updates for 45 minutes',
        description:
          'An automated filter over-blocked AI-related news following a ruleset change, delaying publication until engineers intervened.',
        source: 'AI Newswire',
        url: 'https://example.com/content-filter-outage',
        publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ];

    return articles.slice(0, limit);
  }
}

module.exports = SampleProvider;
