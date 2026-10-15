const fs = require('fs');
const { queryGemini } = require('./gemini_service');
const { queryClaude, evaluateResponse } = require('./claude_service');
const { getGoogleAiModeSerp, getGoogleOrganicSerp } = require('./dataforseo_service');

const TARGET_BRAND = 'Pulp Digital';
const QUERIES = [
  { id: 'Q1', text: 'Who are the best paid ads ecommerce agencies in Australia?' },
  { id: 'Q2', text: 'What are the top ecommerce performance marketing agencies in Melbourne?' },
  { id: 'Q3', text: 'Which are the best Meta ads and paid social agencies for Shopify brands in Australia?' },
  { id: 'Q4', text: 'Which agency should a 7-figure ecommerce brand hire for paid ads in Australia?' }
];

async function runInvestigation() {
  console.log('=== STARTING MINIMAL AEO/GEO INVESTIGATION FOR PULP DIGITAL ===\n');
  const results = [];

  // 1. Run Gemini 3.8 with Google Search Grounding across the 4 queries
  console.log('--- 1. Querying Gemini 3.8 with Google Search Grounding ---');
  for (const q of QUERIES) {
    console.log(`Querying Gemini [${q.id}]: "${q.text}"...`);
    try {
      const gRes = await queryGemini(q.text);
      const evalRes = await evaluateResponse(gRes.text, TARGET_BRAND);
      results.push({
        queryId: q.id,
        queryText: q.text,
        engine: 'Gemini 3.8 (Search Grounded)',
        rawAnswer: gRes.text,
        searchQueries: gRes.searchQueries,
        evaluation: evalRes
      });
      console.log(`-> Mentioned? ${evalRes.target_mentioned} | Rank: ${evalRes.target_rank_position} | Stance: ${evalRes.stance}`);
      console.log(`-> Competitors named: ${evalRes.all_named_entities_in_order?.slice(0, 5).join(', ')}`);
    } catch (e) {
      console.error(`Gemini query ${q.id} error:`, e.message);
    }
  }

  // 2. Run Claude Sonnet on Q1 and Q2
  console.log('\n--- 2. Querying Claude Sonnet ---');
  for (const q of QUERIES.slice(0, 2)) {
    console.log(`Querying Claude [${q.id}]: "${q.text}"...`);
    try {
      const cRes = await queryClaude(q.text);
      const evalRes = await evaluateResponse(cRes, TARGET_BRAND);
      results.push({
        queryId: q.id,
        queryText: q.text,
        engine: 'Claude Sonnet 4.5',
        rawAnswer: cRes,
        evaluation: evalRes
      });
      console.log(`-> Mentioned? ${evalRes.target_mentioned} | Rank: ${evalRes.target_rank_position} | Stance: ${evalRes.stance}`);
      console.log(`-> Competitors named: ${evalRes.all_named_entities_in_order?.slice(0, 5).join(', ')}`);
    } catch (e) {
      console.error(`Claude query ${q.id} error:`, e.message);
    }
  }

  // 3. Single DataForSEO check for Google AI Mode / SERP (preserve credits)
  console.log('\n--- 3. Single DataForSEO Google AI Mode Check (Preserving Credits) ---');
  try {
    const aiMode = await getGoogleAiModeSerp('best ecommerce paid ads agency Melbourne', 'Melbourne,Victoria,Australia');
    if (aiMode) {
      console.log('DataForSEO AI Mode items count:', aiMode.items_count || 0);
      const items = aiMode.items || [];
      const aiOverviewItem = items.find(it => it.type === 'ai_overview');
      const overviewText = aiOverviewItem?.text || JSON.stringify(items.slice(0, 3));
      const evalRes = await evaluateResponse(overviewText, TARGET_BRAND);
      results.push({
        queryId: 'SERP_AI_MODE',
        queryText: 'best ecommerce paid ads agency Melbourne',
        engine: 'Google AI Mode (Melbourne)',
        rawAnswer: overviewText,
        evaluation: evalRes
      });
      console.log(`-> AI Mode Mentioned? ${evalRes.target_mentioned} | Top: ${evalRes.all_named_entities_in_order?.slice(0, 5).join(', ')}`);
    }
  } catch (e) {
    console.log('DataForSEO AI Mode check note:', e.message);
  }

  // Save all raw results
  fs.writeFileSync('pulp_investigation_results.json', JSON.stringify(results, null, 2));
  console.log('\n=== INVESTIGATION COMPLETED & SAVED TO pulp_investigation_results.json ===');
}

runInvestigation().catch(console.error);
