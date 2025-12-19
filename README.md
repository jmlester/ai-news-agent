# AI News Agent

A compact Express service that aggregates AI incident coverage, deduplicates overlapping stories, and optionally summarizes them for quick consumption.

## Features
- Pulls stories from multiple providers (NewsAPI when configured, plus built-in curated sample data) and sorts by recency.
- Optional summarization via OpenAI with a lightweight fallback summarizer when no API key is present.
- In-memory caching to reduce repeat upstream calls for the same query window.
- Health endpoint for uptime checks.

## Getting started

### Prerequisites
- Node.js 18+
- npm
- (Optional) [NewsAPI](https://newsapi.org/) key to fetch live articles
- (Optional) [OpenAI](https://platform.openai.com/) API key for model-generated summaries

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file in the project root (see `.env.example` for a starter template) and set any values you need:

```
PORT=3000
DEFAULT_TOPIC=ai incidents
SUMMARIZE_BY_DEFAULT=true
CACHE_TTL_MS=300000
NEWSAPI_KEY=your-news-api-key
OPENAI_API_KEY=your-openai-key
```

All environment variables are optional. Without NewsAPI or OpenAI keys the service still responds using curated sample incidents and the built-in heuristic summarizer.

### Running the server
```bash
npm start
```
The service will boot on `http://localhost:3000` by default.

For development with auto-reload:
```bash
npm run dev
```

### API
- `GET /health` — basic health probe.
- `GET /news?topic=<string>&limit=<1-50>&summarize=<true|false>` — fetches up to `limit` articles on the topic, deduplicated and sorted by date. Summaries are included when `summarize` is true (defaults to the `SUMMARIZE_BY_DEFAULT` setting).

Example response:
```json
{
  "topic": "ai incidents",
  "count": 2,
  "articles": [
    {
      "title": "Content filter outage delays news updates for 45 minutes",
      "description": "An automated filter over-blocked AI-related news...",
      "source": "AI Newswire",
      "url": "https://example.com/content-filter-outage",
      "publishedAt": "2024-06-01T08:15:00.000Z",
      "summary": "Short recap of what failed and its impact."
    }
  ]
}
```

### Testing
The project uses Node's built-in test runner:
```bash
npm test
```

## Project structure
```
ai-news-agent/
├── src/
│   ├── app.js              # Express app wiring
│   ├── config/             # Environment handling
│   ├── logger.js           # Minimal structured logger
│   ├── routes/             # HTTP routes
│   └── services/           # Aggregator, providers, summarizer, cache
├── tests/                  # Unit tests
├── package.json
└── README.md
```

## Notes
- The sample provider keeps the API useful even without external credentials.
- Swap or extend providers in `src/app.js` to add more sources.
