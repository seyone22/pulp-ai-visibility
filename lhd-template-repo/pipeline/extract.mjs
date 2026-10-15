import fs from 'fs';
import { ENV } from './dfs.mjs';
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY, timeout: 180_000, maxRetries: 3 });

const SCHEMA = {
  type: 'object', additionalProperties: false, required: ['firms'],
  properties: { firms: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['name','role'],
    properties: { name: { type: 'string' }, role: { type: 'string', enum: ['recommended','mentioned'] } } } } },
};
const SYSTEM = `You read one answer that an AI assistant gave to an Australian looking for a lawyer, and list every law firm the answer names, in the order each first appears.
Rules:
- Include only law firms and lawyers' practices (a named individual lawyer counts as their firm if the firm is named; otherwise use the lawyer's name).
- Exclude directories, ranking guides, review sites, regulators, insurers, government schemes and agencies (e.g. Doyle's Guide, Best Lawyers, LawConnect, Law Society, icare, SIRA, TAC, WorkSafe, iCare, Comcare, Legal Aid, NSW Health "Local Health Districts").
- "LHD" means LHD Lawyers only when it refers to a law firm; a "Local Health District" is not a law firm.
- Use the firm's common brand name, e.g. "Slater and Gordon", "Maurice Blackburn", "Shine Lawyers", "LHD Lawyers", "Carroll & O'Dea", "Turner Freeman", "Beilby Poulden Costello (BPC)", "Stacks Goudkamp", "Gerard Malouf & Partners".
- role = "recommended" when the answer presents the firm as an option to contact or a top pick (lists, cards, tables count); "mentioned" for passing references (e.g. "unlike X").
- If no firm is named, return an empty list.`;

const answers = JSON.parse(fs.readFileSync('answers.json')).filter(a=>a.platform!=='serp');
const key = a => `${a.city}__${a.prompt}__${a.platform}`;
const todo = answers.filter(a => !fs.existsSync(`extract/${key(a)}.json`));
console.log('to extract', todo.length);
let done = 0;
async function one(a) {
  const body = [a.cards.length ? 'Business cards shown with the answer:\n' + a.cards.map(c=>`- ${c.title} (${c.domain})`).join('\n') + '\n\n' : '', 'Answer:\n', a.text].join('');
  const res = await client.beta.messages.create({
    model: 'claude-opus-5-5', max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default',
    output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA } },
    system: SYSTEM,
    messages: [{ role: 'user', content: `Question asked: ${a.query}\n\n${body}` }],
  });
  if (res.stop_reason === 'refusal') throw new Error('refusal');
  const txt = res.content.filter(b=>b.type==='text').map(b=>b.text).join('');
  const parsed = JSON.parse(txt);
  fs.writeFileSync(`extract/${key(a)}.json`, JSON.stringify(parsed));
  done++; if (done % 25 === 0) console.log('extracted', done);
}
const queue = [...todo];
await Promise.all(Array.from({length: 8}, async () => {
  while (queue.length) { const a = queue.shift(); try { await one(a); } catch (e) { console.log('ERR', key(a), e.status ?? '', e.message?.slice(0,200)); } }
}));
console.log('done', done);
