import fs from 'fs';
const A = JSON.parse(fs.readFileSync('answers.json'));
const canon = JSON.parse(fs.readFileSync('canon.json'));
const CITIES = ['sydney','melbourne','brisbane','perth','adelaide','canberra','newcastle','hobart'];
const PLAT = ['chatgpt','aimode','gemini','perplexity','claude'];
const PROMPTS = ['general','workers','motor','nwnf','medneg','tpd','publiab'];
const ans = A.filter(a=>a.platform!=='serp').map(a=>{
  const ex = JSON.parse(fs.readFileSync(`extract/${a.city}__${a.prompt}__${a.platform}.json`)).firms;
  const firms=[]; for (const f of ex){ const n=canon[f.name]||f.name; if(!firms.find(x=>x.name===n)) firms.push({name:n, role:f.role}); }
  return {...a, firms};
});
// sanity check LHD
const rx = a => /LHD Lawyers|lhd\.com\.au/i.test(a.text) || /\bLHD\b(?!s)(?! \(Local)/.test(a.text) || a.cards.some(c=>/LHD/i.test(c.title));
const exHas = a => a.firms.some(f=>f.name==='LHD Lawyers');
console.log('regex-but-not-extracted', ans.filter(a=>rx(a)&&!exHas(a)).map(a=>`${a.city}/${a.prompt}/${a.platform}: ${(a.text.match(/.{0,80}\bLHD\b.{0,80}/)||[''])[0].replace(/\n/g,' ')}`));
console.log('extracted-but-no-regex', ans.filter(a=>!rx(a)&&exHas(a)).map(a=>`${a.city}/${a.prompt}/${a.platform}`));
fs.writeFileSync('ans_full.json', JSON.stringify(ans));
