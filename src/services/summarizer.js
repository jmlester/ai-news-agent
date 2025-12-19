const { OpenAI } = require('openai');

class Summarizer {
  constructor(apiKey, logger) {
    this.logger = logger;
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  async summarize(text) {
    if (!text) return '';
    if (!this.client) return this.simpleSummary(text);

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Summarize AI incident reports in 2 concise sentences highlighting what failed and its impact.',
          },
          {
            role: 'user',
            content: text,
          },
        ],
        max_tokens: 120,
        temperature: 0.3,
      });

      return response.choices?.[0]?.message?.content?.trim() || this.simpleSummary(text);
    } catch (error) {
      this.logger.warn('OpenAI summarization failed, falling back to simple summary', { error: error.message });
      return this.simpleSummary(text);
    }
  }

  simpleSummary(text) {
    const sentences = text
      .replace(/\n+/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean);

    const condensed = sentences.slice(0, 2).join(' ');
    return condensed || text.slice(0, 220);
  }
}

module.exports = Summarizer;
