import fs from 'fs';
import {post,spent} from './dfs.mjs';
export const CITIES = [
  ['sydney','Sydney',1000286],['melbourne','Melbourne',1000567],['brisbane','Brisbane',1000339],['perth','Perth',1000676],
  ['adelaide','Adelaide',1000422],['canberra','Canberra',1000142],['newcastle','Newcastle',1000255],['hobart','Hobart',1000480],
];
export const PROMPTS = [
  ['general','Who are the best personal injury lawyers in {C}?','personal injury lawyers {c}'],
  ['workers','Who are the best workers compensation lawyers in {C}?','workers compensation lawyers {c}'],
  ['motor','I was hurt in a car accident in {C}. Which compensation lawyers should I contact?','car accident lawyers {c}'],
  ['nwnf','Which no win no fee compensation lawyers in {C} would you recommend?','no win no fee lawyers {c}'],
  ['medneg','Who are the top medical negligence lawyers in {C}?','medical negligence lawyers {c}'],
  ['tpd','Which lawyers in {C} are best for TPD and superannuation insurance claims?','tpd claim lawyers {c}'],
  ['publiab','I slipped and fell in a shopping centre in {C}. Which public liability lawyers are best?','public liability lawyers {c}'],
];
const PLATFORMS = {
  chatgpt: (p,loc)=>post('/ai_optimization/chat_gpt/llm_scraper/live/advanced',{keyword:p,location_code:2036,language_code:'en',force_web_search:true}),
  gemini: (p,loc)=>post('/ai_optimization/gemini/llm_scraper/live/advanced',{keyword:p,location_code:loc,language_code:'en'}),
  aimode: (p,loc)=>post('/serp/google/ai_mode/live/advanced',{keyword:p,location_code:loc,language_code:'en',device:'desktop'}),
  perplexity: (p,loc)=>post('/ai_optimization/perplexity/llm_responses/live',{user_prompt:p,model_name:'sonar',max_output_tokens:2000,web_search:true,web_search_country_iso_code:'AU'}),
  claude: (p,loc)=>post('/ai_optimization/claude/llm_responses/live',{user_prompt:p,model_name:'claude-sonnet-4-6',max_output_tokens:2000,web_search:true,web_search_country_iso_code:'AU'}),
  serp: (k,loc)=>post('/serp/google/organic/live/advanced',{keyword:k,location_code:loc,language_code:'en',device:'desktop',os:'windows',depth:20,load_async_ai_overview:true}),
};
const jobs=[];
const only = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : null;
for (const [slug,City,loc] of CITIES) for (const [pk,tpl,kw] of PROMPTS) for (const plat of Object.keys(PLATFORMS)) {
  if (only && !only.split(',').includes(plat)) continue;
  const text = plat==='serp' ? kw.replace('{c}',City.toLowerCase()) : tpl.replace('{C}',City);
  const file = `raw/${slug}__${pk}__${plat}.json`;
  if (fs.existsSync(file)) continue;
  jobs.push({slug,pk,plat,text,loc,file});
}
if (process.argv.includes('--rev')) jobs.reverse(); console.log('jobs',jobs.length);
let done=0, fail=0;
async function worker(){
  while(jobs.length){
    const j=jobs.shift(); if (fs.existsSync(j.file)) continue;
    const t0=Date.now();
    const r = await PLATFORMS[j.plat](j.text,j.loc);
    if (r?.status_code===20000) { fs.writeFileSync(j.file, JSON.stringify({...j, at:new Date().toISOString(), cost:r.cost, result:r.result})); done++; }
    else { fail++; fs.appendFileSync('errors.log', `${j.file} ${r?.status_code} ${r?.status_message||r?.error}\n`); }
    if ((done+fail)%20===0) console.log(`done ${done} fail ${fail} left ${jobs.length} spent $${spent.toFixed(3)} last ${((Date.now()-t0)/1000)|0}s`);
  }
}
await Promise.all(Array.from({length:14},worker));
console.log(`FINISHED done ${done} fail ${fail} spent $${spent.toFixed(3)}`);
