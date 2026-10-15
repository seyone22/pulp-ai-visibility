/**
 * DataForSEO Service Module for AEO / GEO Research
 * Handles Google AI Mode/Overviews, Local 3-Pack SERPs, and LLM Mentions.
 */

const fs = require('fs');
const path = require('path');

function getAuthHeader() {
  if (process.env.DATAFORSEO_AUTH) {
    return 'Basic ' + process.env.DATAFORSEO_AUTH;
  }
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/DATAFORSEO_AUTH=([^\r\n]+)/);
    if (match) return 'Basic ' + match[1].trim();
  }
  return '';
}

const API_BASE = 'https://api.dataforseo.com/v3';

/**
 * Fetch Google Organic SERP with Local Map Pack
 * @param {string} keyword Search keyword (e.g. "personal injury lawyers Sydney")
 * @param {string} locationName City location (e.g. "Sydney,New South Wales,Australia")
 */
async function getGoogleOrganicSerp(keyword, locationName = 'Sydney,New South Wales,Australia') {
  const auth = getAuthHeader();
  const res = await fetch(`${API_BASE}/serp/google/organic/live/advanced`, {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([{
      keyword,
      location_name: locationName,
      language_name: 'English',
      device: 'desktop',
      depth: 20
    }])
  });

  const json = await res.json();
  if (json.status_code !== 20000) {
    throw new Error(`DataForSEO SERP failed (${json.status_code}): ${json.status_message}`);
  }
  return json.tasks[0]?.result[0] || null;
}

/**
 * Fetch Google AI Mode / AI Overview for a query
 * @param {string} keyword Search prompt
 * @param {string} locationName City location
 */
async function getGoogleAiModeSerp(keyword, locationName = 'Sydney,New South Wales,Australia') {
  const auth = getAuthHeader();
  const res = await fetch(`${API_BASE}/serp/google/ai_mode/live/advanced`, {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([{
      keyword,
      location_name: locationName,
      language_name: 'English',
      device: 'desktop'
    }])
  });

  const json = await res.json();
  if (json.status_code !== 20000) {
    throw new Error(`DataForSEO AI Mode failed (${json.status_code}): ${json.status_message}`);
  }
  return json.tasks[0]?.result[0] || null;
}

/**
 * Get account balance
 */
async function getAccountInfo() {
  const auth = getAuthHeader();
  const res = await fetch(`${API_BASE}/appendix/user_data`, {
    method: 'GET',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json'
    }
  });
  const json = await res.json();
  return json.tasks[0]?.result[0] || null;
}

module.exports = {
  getAuthHeader,
  getGoogleOrganicSerp,
  getGoogleAiModeSerp,
  getAccountInfo
};
