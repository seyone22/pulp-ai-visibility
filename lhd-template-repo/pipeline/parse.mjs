import fs from 'fs';
const host = u => { try { return new URL(u).hostname.replace(/^www\./,''); } catch { return ''; } };
const out = [];
for (const f of fs.readdirSync('raw')) {
  const d = JSON.parse(fs.readFileSync('raw/'+f));
  const r = d.result?.[0]; if (!r) continue;
  let text = '', sources = [], cards = [];
  if (d.plat==='chatgpt') {
    text = r.markdown || (r.items||[]).map(i=>i.markdown||'').join('\n\n');
    for (const it of r.items||[]) if (it.type==='chat_gpt_local_businesses') for (const b of it.items||[]) cards.push({title:b.title, domain:host(b.url||'')||b.domain});
    sources = (r.sources||[]).map(s=>({title:s.title, domain:host(s.url)||s.domain, url:s.url}));
  } else if (d.plat==='gemini') {
    text = r.markdown || (r.items||[]).map(i=>i.markdown||'').join('\n\n');
    sources = (r.sources||[]).map(s=>({title:s.title, domain:host(s.url)||s.domain, url:s.url}));
  } else if (d.plat==='aimode' || d.plat==='serp') {
    const ai = (r.items||[]).find(i=>i.type==='ai_overview');
    if (d.plat==='serp') {
      const lp = (r.items||[]).filter(i=>i.type==='local_pack').map(i=>({title:i.title, domain:host(i.url||'')||i.domain, rating:i.rating?.value, votes:i.rating?.votes_count}));
      const org = (r.items||[]).filter(i=>i.type==='organic').map(i=>({rank:i.rank_group, domain:host(i.url), url:i.url, title:i.title}));
      out.push({city:d.slug, prompt:d.pk, platform:'serp', query:d.text, at:d.at, localPack:lp, organic:org, aio: ai ? (ai.markdown||'') : null,
        aioSources: ai ? (ai.items||[]).flatMap(e=>e.references||[]).map(s=>({title:s.title, domain:host(s.url)||s.domain, url:s.url})) : []});
      continue;
    }
    if (ai) {
      text = ai.markdown || (ai.items||[]).map(e=>e.markdown||e.text||'').join('\n\n');
      sources = (ai.items||[]).flatMap(e=>e.references||[]).concat(ai.references||[]).map(s=>({title:s.title, domain:host(s.url)||s.domain, url:s.url}));
    }
  } else {
    const secs = r.items?.[0]?.sections||[];
    text = secs.map(s=>s.text||'').join('');
    sources = secs.flatMap(s=>s.annotations||[]).map(a=>({title:a.title, domain:host(a.url), url:a.url}));
  }
  // dedupe sources by url
  const seen = new Set(); sources = sources.filter(s=>{ const k=s.url||s.title; if(!k||seen.has(k)) return false; seen.add(k); return true; });
  out.push({city:d.slug, prompt:d.pk, platform:d.plat, query:d.text, at:d.at, text, cards, sources});
}
fs.writeFileSync('answers.json', JSON.stringify(out));
const ans = out.filter(a=>a.platform!=='serp');
console.log('answers', ans.length, 'serp', out.length-ans.length, 'empty', ans.filter(a=>!a.text).map(a=>a.city+'/'+a.prompt+'/'+a.platform));
const lhd = a => /\bLHD\b/i.test(a.text) || a.cards.some(c=>/\bLHD\b/i.test(c.title)||/lhd\.com\.au/.test(c.domain));
console.log('LHD mentioned', ans.filter(lhd).map(a=>a.city+'/'+a.prompt+'/'+a.platform));
console.log('LHD cited', ans.filter(a=>a.sources.some(s=>/lhd\.com\.au/.test(s.domain))).map(a=>a.city+'/'+a.prompt+'/'+a.platform));
