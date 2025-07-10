require('dotenv').config();
const { OpenAI } = require('openai');
const { GoogleGenAI } = require('@google/genai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateAgentResponse(context, userInput) {
  const systemPrompt = `...`; // Same as before

  let responseText = '';
  try {
    const gem = await gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt + '\n' + userInput,
    });
    responseText = gem.text;
  } catch (gemErr) {
    console.warn('Gemini failed, falling back to OpenAI:', gemErr.message);
    const comp = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput },
      ],
      max_tokens: 200,
    });
    responseText = comp.choices[0]?.message?.content || '';
  }

  return { systemPrompt, response: responseText };
}

module.exports = { generateAgentResponse };