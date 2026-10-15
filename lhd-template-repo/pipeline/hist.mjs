import fs from 'fs';
import {post,spent} from './dfs.mjs';
const D = ['lhd.com.au','mauriceblackburn.com.au','slatergordon.com.au','lawpartners.com.au','turnerfreeman.com.au','shine.com.au','gordonlegal.com.au','atb.com.au','bpclaw.com.au','codea.com.au','garlingandco.com.au','hallpayne.com.au','stacksgoudkamp.com.au','gmp.com.au'];
const out = {};
await Promise.all(D.map(async d => {
  const t=[{domain:d,search_filter:'include',search_scope:['any'],include_subdomains:true}];
  const [h, m] = await Promise.all([
    post('/ai_optimization/llm_mentions/historical/live',{target:t,location_code:2036,language_code:'en',platform:'google',date_from:'2025-08-01'}),
    post('/ai_optimization/llm_mentions/target_metrics/live',{target:t,location_code:2036,language_code:'en',platform:'google',internal_list_limit:10}),
  ]);
  out[d] = { hist: h.status_code===20000 ? h.result?.[0]?.items : {err:h.status_message}, metrics: m.status_code===20000 ? m.result?.[0]?.aggregated_metrics : {err:m.status_message} };
}));
fs.writeFileSync('hist.json', JSON.stringify(out,null,1));
for (const d of D) { const h=out[d].hist; console.log(d.padEnd(26), 'total', out[d].metrics?.total?.mentions, '|', Array.isArray(h) ? h.map(i=>`${i.year}-${i.month}:${i.metrics?.mentions??JSON.stringify(i).slice(0,80)}`).join(' ') : JSON.stringify(h)); }
console.log('spent', spent);
