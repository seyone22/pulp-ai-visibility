import fs from 'fs';
import { ENV } from './dfs.mjs';
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY, timeout: 300_000, maxRetries: 3 });
const c = {};
for (const f of fs.readdirSync('extract')) for (const x of JSON.parse(fs.readFileSync('extract/'+f)).firms) c[x.name]=(c[x.name]||0)+1;
const names = Object.keys(c).sort();
console.log('unique names', names.length);
const SCHEMA = { type:'object', additionalProperties:false, required:['map'], properties:{ map:{ type:'array', items:{ type:'object', additionalProperties:false, required:['name','canonical'], properties:{ name:{type:'string'}, canonical:{type:'string'} } } } } };
const stream = client.beta.messages.stream({
  model:'claude-opus-5-5', max_tokens: 64000,
  betas:['server-side-fallback-2026-07-01'], fallbacks:'default',
  output_config:{ effort:'medium', format:{ type:'json_schema', schema: SCHEMA } },
  system: `You merge spellings of Australian law firm names. For every input name, return the canonical brand name of the firm it refers to. Variants of the same firm (suffixes like "Lawyers", "Injury Lawyers", "Compensation Lawyers", "& Co" vs "& Co Lawyers", abbreviations like BPC/ADM/KW, office names such as "Maurice Blackburn Sydney", individual lawyers named with their firm) map to one canonical name. Keep genuinely different firms separate (e.g. "Arnold Thomas & Becker" and "Arnold Dallas McPherson" are different firms; "Gordon Legal" and "Slater and Gordon" are different firms). Use these canonical names where they apply: "Maurice Blackburn", "Slater and Gordon", "Shine Lawyers", "LHD Lawyers", "Law Partners", "Turner Freeman", "Carroll & O'Dea", "Beilby Poulden Costello (BPC)", "Gordon Legal", "Arnold Thomas & Becker", "Garling & Co", "Stacks Goudkamp", "Gerard Malouf & Partners", "Hall Payne", "Firths", "Blumers", "Taylor & Scott". Return every input name exactly once.`,
  messages:[{ role:'user', content: names.join('\n') }],
});
const res = await stream.finalMessage();
const map = Object.fromEntries(JSON.parse(res.content.filter(b=>b.type==='text').map(b=>b.text).join('')).map.map(x=>[x.name,x.canonical]));
const missing = names.filter(n=>!map[n]); console.log('missing', missing.length, missing.slice(0,10));
for (const n of missing) map[n]=n;
fs.writeFileSync('canon.json', JSON.stringify(map,null,1));
const t={}; for (const [n,k] of Object.entries(c)) t[map[n]]=(t[map[n]]||0)+k;
console.log(Object.entries(t).sort((a,b)=>b[1]-a[1]).slice(0,45).map(([n,k])=>k+' '+n).join('\n'));
