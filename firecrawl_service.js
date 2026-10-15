/**
 * Firecrawl Service Module for AEO / GEO Research
 * Handles live web search, deep directory scraping, and markdown extraction.
 */

const fs = require('fs');
const path = require('path');

// Load API key from .env or environment
function getApiKey() {
  if (process.env.FIRECRAWL_API_KEY) {
    return process.env.FIRECRAWL_API_KEY;
  }
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/FIRECRAWL_API_KEY=([^\r\n]+)/);
    if (match) return match[1].trim();
  }
  return process.env.FIRECRAWL_API_KEY || '';
}

const API_BASE = 'https://api.firecrawl.dev/v1';

/**
 * Scrape a URL to clean markdown
 * @param {string} url Target webpage URL
 * @param {object} options Additional Firecrawl scrape options
 */
async function scrapeUrl(url, options = {}) {
  const apiKey = getApiKey();
  const res = await fetch(`${API_BASE}/scrape`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      url,
      formats: ['markdown'],
      onlyMainContent: true,
      ...options
    })
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(`Firecrawl scrape failed (${res.status}): ${json.error || JSON.stringify(json)}`);
  }
  return json.data;
}

/**
 * Execute web search query and return clean markdown results
 * @param {string} query Search prompt
 * @param {number} limit Number of results (default: 5)
 */
async function searchWeb(query, limit = 5) {
  const apiKey = getApiKey();
  const res = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      query,
      limit,
      scrapeOptions: {
        formats: ['markdown'],
        onlyMainContent: true
      }
    })
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(`Firecrawl search failed (${res.status}): ${json.error || JSON.stringify(json)}`);
  }
  return json.data;
}

module.exports = {
  getApiKey,
  scrapeUrl,
  searchWeb
};
