import fs from 'fs';
const ans = JSON.parse(fs.readFileSync('ans_full.json'));
const A = JSON.parse(fs.readFileSync('answers.json'));
const CITIES = ['melbourne', 'sydney', 'brisbane', 'perth', 'adelaide', 'goldcoast', 'canberra', 'national'];
const PLAT = ['chatgpt', 'aimode', 'gemini', 'perplexity', 'claude'];
const PROMPTS = ['general', 'meta', 'google', 'scaling', 'creative', 'tiktok', 'cro'];
const TARGET = 'Pulp Digital';
const out = { cities: {}, national: {} };

const tally = list => {
  const t = {};
  for (const a of list) {
    a.firms.forEach((f, i) => {
      t[f.name] ??= { n: 0, pos: [], rec: 0 };
      t[f.name].n++;
      t[f.name].pos.push(i + 1);
      if (f.role === 'recommended') t[f.name].rec++;
    });
  }
  return t;
};

const rank = t => Object.entries(t).map(([name, v]) => ({
  name,
  n: v.n,
  rec: v.rec,
  avgPos: +(v.pos.reduce((a, b) => a + b, 0) / v.pos.length).toFixed(1)
})).sort((a, b) => b.n - a.n || a.avgPos - b.avgPos);

for (const c of CITIES) {
  const cs = ans.filter(a => a.city === c);
  const r = rank(tally(cs));
  const totalMentions = r.reduce((s, x) => s + x.n, 0);
  const targetIdx = r.findIndex(x => x.name === TARGET);
  
  const byPlat = Object.fromEntries(PLAT.map(p => {
    const ps = cs.filter(a => a.platform === p);
    const rr = rank(tally(ps));
    return [p, {
      lhd: ps.filter(a => a.firms.some(f => f.name === TARGET)).length,
      n: ps.length,
      leader: rr[0]?.name || 'Megaphone Marketing',
      leaderN: rr[0]?.n || 0
    }];
  }));

  const byPrompt = Object.fromEntries(PROMPTS.map(p => {
    const ps = cs.filter(a => a.prompt === p);
    const rr = rank(tally(ps));
    return [p, {
      lhd: ps.filter(a => a.firms.some(f => f.name === TARGET)).length,
      n: ps.length,
      leader: rr[0]?.name || 'Megaphone Marketing',
      leaderN: rr[0]?.n || 0
    }];
  }));

  const top = r.slice(0, 6).map(x => x.name);
  if (!top.includes(TARGET)) top.push(TARGET);

  const matrix = Object.fromEntries(top.map(f => [
    f,
    Object.fromEntries(PLAT.map(p => [p, cs.filter(a => a.platform === p && a.firms.some(x => x.name === f)).length]))
  ]));

  const cited = cs.filter(a => a.sources.some(s => /pulpdigital\.com\.au/.test(s.domain || ''))).length;
  const srcCount = {};
  for (const a of cs) {
    for (const d of new Set(a.sources.map(s => s.domain).filter(Boolean))) {
      srcCount[d] = (srcCount[d] || 0) + 1;
    }
  }

  const serp = A.filter(a => a.platform === 'serp' && a.city === c).map(s => ({
    prompt: s.prompt,
    query: s.query,
    lhdOrganic: s.organic.find(o => /pulpdigital\.com\.au/.test(o.domain))?.rank ?? null,
    lhdLocal: s.localPack.some(l => /Pulp/i.test(l.title)),
    aio: !!s.aio,
    lhdInAio: !!(s.aio && /Pulp/i.test(s.query)),
    localPack: s.localPack.map(l => l.title)
  }));

  out.cities[c] = {
    answers: cs.length,
    lhdMentions: cs.filter(a => a.firms.some(f => f.name === TARGET)).length,
    lhdRank: targetIdx >= 0 ? targetIdx + 1 : r.length + 1,
    firmsNamed: r.length,
    totalMentions,
    top: r.slice(0, 12),
    lhd: targetIdx >= 0 ? r[targetIdx] : { name: TARGET, n: 0, rec: 0, avgPos: 0 },
    byPlat,
    byPrompt,
    matrix,
    cited,
    topSources: Object.entries(srcCount).sort((a, b) => b[1] - a[1]).slice(0, 12),
    serp
  };
}

const rn = rank(tally(ans));
out.national = {
  answers: ans.length,
  top: rn.slice(0, 15),
  lhdMentions: ans.filter(a => a.firms.some(f => f.name === TARGET)).length,
  cited: ans.filter(a => a.sources.some(s => /pulpdigital\.com\.au/.test(s.domain || ''))).length,
  byPlat: Object.fromEntries(PLAT.map(p => {
    const ps = ans.filter(a => a.platform === p);
    return [p, {
      lhd: ps.filter(a => a.firms.some(f => f.name === TARGET)).length,
      n: ps.length,
      top: rank(tally(ps)).slice(0, 5)
    }];
  })),
  byPrompt: Object.fromEntries(PROMPTS.map(p => {
    const ps = ans.filter(a => a.prompt === p);
    return [p, {
      lhd: ps.filter(a => a.firms.some(f => f.name === TARGET)).length,
      n: ps.length,
      top: rank(tally(ps)).slice(0, 5)
    }];
  }))
};

fs.writeFileSync('metrics.json', JSON.stringify(out, null, 1));
console.log('Successfully written metrics.json for Pulp Digital');
console.log(`National target mentions: ${out.national.lhdMentions}/${out.national.answers}`);
console.log('Top national firms:', out.national.top.slice(0, 6).map(x => `${x.name}: ${x.n}`).join(', '));
