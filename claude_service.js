/**
 * Claude Service Module for AEO / GEO Research
 * Handles live Claude queries with web search and automated LLM-as-a-Judge scoring.
 */

const fs = require('fs');
const path = require('path');

function getApiKey() {
  if (process.env.ANTHROPIC_API_KEY) {
    return process.env.ANTHROPIC_API_KEY;
  }
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/ANTHROPIC_API_KEY=([^\r\n]+)/);
    if (match) return match[1].trim();
  }
  return process.env.ANTHROPIC_API_KEY || '';
}

const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929';

/**
 * Ask Claude a research prompt
 * @param {string} prompt User prompt
 * @param {object} options Optional parameters
 */
async function queryClaude(prompt, options = {}) {
  const apiKey = getApiKey();
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: options.model || DEFAULT_MODEL,
      max_tokens: options.max_tokens || 1024,
      messages: [{ role: 'user', content: prompt }],
      ...options
    })
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Claude API failed (${res.status}): ${json.error?.message || JSON.stringify(json)}`);
  }
  return json.content?.[0]?.text || '';
}

/**
 * LLM-as-a-Judge: Extracts named entities, positions, and stance from any AI response text
 * @param {string} answerText Raw text output from an AI engine
 * @param {string} targetBrand Canonical target brand to evaluate
 */
async function evaluateResponse(answerText, targetBrand) {
  const judgePrompt = `
You are an expert NLP data scientist auditing AI visibility.
Analyze the following AI answer for mentions of companies/service providers.

Target Entity to inspect: "${targetBrand}"

AI Answer Text:
"""
${answerText}
"""

Return a clean JSON object with this exact schema:
{
  "target_mentioned": true/false,
  "target_rank_position": 1-indexed number or null,
  "stance": "Strongly Recommended" | "Neutral" | "Cautionary" | "Not Mentioned",
  "stance_score": 1.0 | 0.5 | -0.5 | 0.0,
  "all_named_entities_in_order": ["Firm 1", "Firm 2", ...],
  "hallucinated_facts": ["description of any obvious hallucination, or empty array"],
  "cited_sources": ["urls or domain names cited in the text"]
}
Only return valid JSON. Do not wrap in markdown quotes if possible.`;

  const rawJudgeOutput = await queryClaude(judgePrompt, { max_tokens: 1000 });
  try {
    const cleaned = rawJudgeOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return { raw: rawJudgeOutput, error: e.message };
  }
}

module.exports = {
  getApiKey,
  queryClaude,
  evaluateResponse
};
