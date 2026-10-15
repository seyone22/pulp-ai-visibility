import fs from 'fs';
const ans = JSON.parse(fs.readFileSync('ans_full.json'));
const A = JSON.parse(fs.readFileSync('answers.json'));
const CITIES = ['sydney','melbourne','brisbane','perth','adelaide','canberra','newcastle','hobart'];
const PLAT = ['chatgpt','aimode','gemini','perplexity','claude'];
const PROMPTS = ['general','workers','motor','nwnf','medneg','tpd','publiab'];
const L='LHD Lawyers';
const out = { cities:{}, national:{} };
const tally = list => { const t={}; for (const a of list) a.firms.forEach((f,i)=>{ t[f.name] ??= {n:0, pos:[], rec:0}; t[f.name].n++; t[f.name].pos.push(i+1); if(f.role==='recommended') t[f.name].rec++; }); return t; };
const rank = t => Object.entries(t).map(([name,v])=>({name, n:v.n, rec:v.rec, avgPos:+(v.pos.reduce((a,b)=>a+b,0)/v.pos.length).toFixed(1)})).sort((a,b)=>b.n-a.n || a.avgPos-b.avgPos);
for (const c of CITIES) {
  const cs = ans.filter(a=>a.city===c);
  const r = rank(tally(cs));
  const totalMentions = r.reduce((s,x)=>s+x.n,0);
  const lhdIdx = r.findIndex(x=>x.name===L);
  const byPlat = Object.fromEntries(PLAT.map(p=>{ const ps=cs.filter(a=>a.platform===p); const rr=rank(tally(ps)); return [p,{lhd: ps.filter(a=>a.firms.some(f=>f.name===L)).length, n: ps.length, leader: rr[0]?.name, leaderN: rr[0]?.n}]; }));
  const byPrompt = Object.fromEntries(PROMPTS.map(p=>{ const ps=cs.filter(a=>a.prompt===p); const rr=rank(tally(ps)); return [p,{lhd: ps.filter(a=>a.firms.some(f=>f.name===L)).length, n: ps.length, leader: rr[0]?.name, leaderN: rr[0]?.n}]; }));
  // matrix top firms x platform
  const top = r.slice(0,6).map(x=>x.name); if (!top.includes(L)) top.push(L);
  const matrix = Object.fromEntries(top.map(f=>[f, Object.fromEntries(PLAT.map(p=>[p, cs.filter(a=>a.platform===p && a.firms.some(x=>x.name===f)).length]))]));
  const cited = cs.filter(a=>a.sources.some(s=>/lhd\.com\.au/.test(s.domain))).length;
  const srcCount = {}; for (const a of cs) for (const d of new Set(a.sources.map(s=>s.domain).filter(Boolean))) srcCount[d]=(srcCount[d]||0)+1;
  const serp = A.filter(a=>a.platform==='serp'&&a.city===c).map(s=>({prompt:s.prompt, query:s.query, lhdOrganic: s.organic.find(o=>/lhd\.com\.au/.test(o.domain))?.rank ?? null, lhdLocal: s.localPack.some(l=>/LHD/i.test(l.title)||/lhd\.com\.au/.test(l.domain||'')), aio: !!s.aio, lhdInAio: !!(s.aio && /\bLHD\b/.test(s.aio)), localPack: s.localPack.map(l=>l.title)}));
  out.cities[c] = { answers: cs.length, lhdMentions: cs.filter(a=>a.firms.some(f=>f.name===L)).length, lhdRank: lhdIdx+1, firmsNamed: r.length, totalMentions, top: r.slice(0,12), lhd: r[lhdIdx], byPlat, byPrompt, matrix, cited, topSources: Object.entries(srcCount).sort((a,b)=>b[1]-a[1]).slice(0,12), serp };
}
const rn = rank(tally(ans));
out.national = { answers: ans.length, top: rn.slice(0,15), lhdMentions: ans.filter(a=>a.firms.some(f=>f.name===L)).length, cited: ans.filter(a=>a.sources.some(s=>/lhd\.com\.au/.test(s.domain))).length,
  byPlat: Object.fromEntries(PLAT.map(p=>{const ps=ans.filter(a=>a.platform===p); return [p,{lhd: ps.filter(a=>a.firms.some(f=>f.name===L)).length, n: ps.length, top: rank(tally(ps)).slice(0,5)}];})),
  byPrompt: Object.fromEntries(PROMPTS.map(p=>{const ps=ans.filter(a=>a.prompt===p); return [p,{lhd: ps.filter(a=>a.firms.some(f=>f.name===L)).length, n: ps.length, top: rank(tally(ps)).slice(0,5)}];})) };
fs.writeFileSync('metrics.json', JSON.stringify(out,null,1));
for (const c of CITIES) { const m=out.cities[c]; console.log(`\n== ${c.toUpperCase()}  LHD ${m.lhdMentions}/${m.answers} rank #${m.lhdRank} of ${m.firmsNamed} | cited ${m.cited}`);
  console.log('  top:', m.top.slice(0,8).map(x=>`${x.name} ${x.n} (p${x.avgPos})`).join(' | '));
  console.log('  plat:', Object.entries(m.byPlat).map(([p,v])=>`${p} ${v.lhd}/${v.n} [${v.leader} ${v.leaderN}]`).join(' | '));
  console.log('  prompt:', Object.entries(m.byPrompt).map(([p,v])=>`${p} ${v.lhd}/${v.n} [${v.leader} ${v.leaderN}]`).join(' | '));
  console.log('  sources:', m.topSources.slice(0,8).map(([d,k])=>d+' '+k).join(', '));
  console.log('  serp:', m.serp.map(s=>`${s.prompt}: org ${s.lhdOrganic??'-'} lp ${s.lhdLocal?'Y':'n'} aio ${s.aio?(s.lhdInAio?'Y*':'Y'):'n'}`).join(' | '));
}
console.log('\nNATIONAL', out.national.lhdMentions, '/', out.national.answers, 'cited', out.national.cited);
console.log(out.national.top.map(x=>`${x.name} ${x.n}`).join(' | '));
console.log(Object.entries(out.national.byPlat).map(([p,v])=>`${p} ${v.lhd}/${v.n} top:${v.top.slice(0,3).map(x=>x.name+' '+x.n).join(',')}`).join('\n'));
console.log(Object.entries(out.national.byPrompt).map(([p,v])=>`${p} ${v.lhd}/${v.n} top:${v.top.slice(0,3).map(x=>x.name+' '+x.n).join(',')}`).join('\n'));
