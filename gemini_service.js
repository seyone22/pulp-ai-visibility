/**
 * Gemini Service Module for AEO / GEO Research
 * Executes live queries against Gemini 3.8 with Google Search Grounding.
 */

const fs = require('fs');
const path = require('path');

function getApiKey() {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GEMINI_API_KEY=([^\r\n]+)/);
    if (match) return match[1].trim();
  }
  return process.env.GEMINI_API_KEY || '';
}

const DEFAULT_MODEL = 'gemini-3.8-flash';

/**
 * Query Gemini with Google Search Grounding enabled
 * @param {string} prompt Research query
 * @param {object} options Optional parameters
 */
async function queryGemini(prompt, options = {}) {
  const apiKey = getApiKey();
  const model = options.model || DEFAULT_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      tools: [{
        google_search: {}
      }],
      ...options
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Gemini API failed (${res.status}): ${data.error?.message || JSON.stringify(data)}`);
  }

  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text || '';
  const searchQueries = candidate?.groundingMetadata?.webSearchQueries || [];
  const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];

  return {
    text,
    searchQueries,
    groundingChunks,
    model
  };
}

module.exports = {
  getApiKey,
  queryGemini
};
