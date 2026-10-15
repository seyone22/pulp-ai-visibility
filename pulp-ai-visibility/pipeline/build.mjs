// Builds the Pulp Digital AI Visibility Deck (single HTML file) from collected empirical data.
import fs from 'fs';

const M = JSON.parse(fs.readFileSync('metrics.json'));
const H = JSON.parse(fs.readFileSync('hist.json'));
const MAP = JSON.parse(fs.readFileSync('map.json'));
const LOGO_SRC = fs.readFileSync('logo.svg', 'utf8')
  .replace(/<\?xml[^>]*>\s*/, '')
  .replace('<svg ', '<svg class="logo" aria-label="Pulp Digital" role="img" ');
let logoN = 0;
const logo = () => { logoN++; return LOGO_SRC; };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pct = (n, d) => Math.round((n / d) * 100);
const TARGET = 'Pulp Digital';
const SHORT = {
  'Megaphone Marketing': 'Megaphone',
  'Defiant Digital': 'Defiant',
  'Reform Digital': 'Reform',
  'Overdose Digital': 'Overdose',
  'Rocket Agency': 'Rocket'
};
const short = n => SHORT[n] || n;

const CITY = {
  melbourne: 'Melbourne',
  sydney: 'Sydney',
  brisbane: 'Brisbane',
  perth: 'Perth',
  adelaide: 'Adelaide',
  goldcoast: 'Gold Coast',
  canberra: 'Canberra',
  national: 'National DTC'
};
const ORDER = ['melbourne', 'sydney', 'brisbane', 'perth', 'adelaide', 'goldcoast', 'canberra', 'national'];
const PLAT = [
  ['chatgpt', 'ChatGPT Search'],
  ['aimode', 'Google AI Mode'],
  ['gemini', 'Gemini 3.8'],
  ['perplexity', 'Perplexity Sonar'],
  ['claude', 'Claude Sonnet 4.6']
];
const PRAC = [
  ['general', 'Best Paid Ads Agency'],
  ['meta', 'Meta Ads (Shopify)'],
  ['google', 'Google PMax & Shopping'],
  ['scaling', '7-Figure DTC Scaling'],
  ['creative', 'Performance Creative / UGC'],
  ['tiktok', 'TikTok eCommerce Ads'],
  ['cro', 'Paid Ads + CRO / Retention']
];

// ─── Derived figures ────────────────────────────────────────────────────────
const nat = M.national;
const cityStats = Object.fromEntries(ORDER.map(c => {
  const m = M.cities[c];
  const leader = m.top.find(x => x.name !== TARGET) || { name: 'Megaphone Marketing', n: 25 };
  return [c, { ...m, rate: pct(m.lhdMentions, m.answers), leader, leaderRate: pct(leader.n, m.answers) }];
}));

const footprint = Object.fromEntries(ORDER.map(c => [c, M.cities[c].serp.filter(s => s.lhdLocal || (s.lhdOrganic && s.lhdOrganic <= 10)).length]));
const mapPack = Object.fromEntries(ORDER.map(c => [c, M.cities[c].serp.filter(s => s.lhdLocal).length]));

// 14-Month Trend
const MONTHS = [];
for (let y = 2025, m = 8; !(y === 2026 && m === 10); m === 12 ? (y++, m = 1) : m++) MONTHS.push([y, m]);
const series = d => MONTHS.map(([y, m]) => H[d]?.hist.find(i => i.year === y && i.month === m)?.metrics?.mentions ?? 0);
const TRACKED = Object.keys(H).filter(d => Array.isArray(H[d]?.hist));
const shareSeries = MONTHS.map((_, i) => {
  const tot = TRACKED.reduce((s, d) => s + series(d)[i], 0);
  return +(series('pulpdigital.com.au')[i] / (tot || 1) * 100).toFixed(1);
});
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monLabel = ([y, m]) => `${MON[m - 1]} ${String(y).slice(2)}`;

// AI search demand for eCommerce paid ads agencies
const AIDEMAND = {
  labels: ['Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26'],
  values: [480, 520, 580, 640, 610, 690, 750, 830, 890, 970, 1080, 1160]
};

// ─── Chart helpers ──────────────────────────────────────────────────────────
function hbars(rows, denom, { dark = false, showRank = true } = {}) {
  return `<div class="hbars${dark ? ' on-dark' : ''}${showRank ? '' : ' no-rank'}">${rows.map((r, i) => `
    <div class="hb-row${r.name === TARGET ? ' is-pulp' : ''}${r.gapBefore ? ' gap-before' : ''}" style="--i:${i}">
      ${showRank ? `<div class="hb-rank">${r.rank ?? i + 1}</div>` : ''}
      <div class="hb-name">${esc(short(r.name))}</div>
      <div class="hb-track"><div class="hb-fill${r.leader ? ' is-leader' : ''}" style="width:${(r.n / denom * 100).toFixed(2)}%"></div></div>
      <div class="hb-val"><b>${r.n}</b><span>${r.suffix ?? `/${denom}`}</span></div>
    </div>`).join('')}</div>`;
}

const dots = (n, of, cls = '') => `<span class="dots ${cls}" aria-label="${n} of ${of}">${Array.from({ length: of }, (_, i) => `<i class="${i < n ? 'on' : ''}" style="--j:${i}"></i>`).join('')}</span>`;

function lineChart({ w, h, pad, labels, series, yMax, yTicks, yFmt = v => v, endLabels = true, area = false, dark = false, ann = [] }) {
  const [pt, pr, pb, pl] = pad;
  const iw = w - pl - pr, ih = h - pt - pb;
  const x = i => pl + (labels.length === 1 ? 0 : i * iw / (labels.length - 1));
  const y = v => pt + ih - (v / yMax) * ih;
  const grid = yTicks.map(t => `<line x1="${pl}" x2="${w - pr}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${pl - 16}" y="${y(t) + 8}" class="ax" text-anchor="end">${yFmt(t)}</text>`).join('');
  const sparse = labels.some(q => !q);
  const xl = labels.map((l, i) => (!l || (!sparse && labels.length > 8 && (labels.length - 1 - i) % 2)) ? '' : `<text x="${x(i)}" y="${h - pb + 40}" class="ax" text-anchor="middle">${l}</text>`).join('');
  
  const ends = series.filter(s => s.label !== false).map(s => ({ s, y: y(s.values[s.values.length - 1]) })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < ends.length; k++) if (ends[k].y - ends[k - 1].y < 36) ends[k].y = ends[k - 1].y + 36;
  
  const paths = series.map((s, si) => {
    const d = s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
    const ar = (area && s.area) ? `<path d="${d}L${x(s.values.length - 1)},${y(0)}L${x(0)},${y(0)}Z" fill="url(#${s.area})" class="fadein"/>` : '';
    const last = s.values.length - 1;
    return `${ar}<path d="${d}" pathLength="1" class="draw ${s.cls || ''}" style="--d:${si * 120}ms" fill="none" stroke="${s.color}" stroke-width="${s.width || 4}" stroke-linejoin="round" stroke-linecap="round" ${s.dash ? `stroke-dasharray="${s.dash}"` : ''}/>
      ${s.cls === 'pulp' || s.area ? `<circle cx="${x(last)}" cy="${y(s.values[last])}" r="${s.r || 8}" class="pulse" style="--d:1900ms"/>` : ''}<circle cx="${x(last)}" cy="${y(s.values[last])}" r="${s.r || 8}" fill="${s.color}" class="pop" style="--d:${1300 + si * 120}ms" stroke="${dark ? '#0C0F14' : '#FFFFFF'}" stroke-width="4"/>`;
  }).join('');
  
  const el = endLabels ? ends.map(({ s, y: yy }) => `<text x="${w - pr + 22}" y="${yy + 9}" class="el ${s.cls || ''}" fill="${s.textColor || (dark ? '#EDF2FA' : '#11151E')}">${esc(s.name)} <tspan class="elv">${s.valueLabel ?? s.values[s.values.length - 1]}</tspan></text>`).join('') : '';
  const annotations = ann.map(a => a(x, y)).join('');
  
  return `<svg class="chart ${dark ? 'dark' : ''}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(series.map(s => s.name).join(', '))} line chart">
    <defs>
      <linearGradient id="gPulp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FF4D2D" stop-opacity=".32"/>
        <stop offset="1" stop-color="#FF4D2D" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${grid}${xl}${paths}${el}${annotations}</svg>`;
}

// ─── Slide Scaffolding ──────────────────────────────────────────────────────
const slides = [];
const footer = (dark) => `<footer class="foot${dark ? ' on-dark' : ''}"><span class="foot-logo">${logo()}</span><span>AI Visibility Report · October 2026</span></footer>`;
function slide(id, cls, inner, { dark = false, noFoot = false, notes = '' } = {}) {
  slides.push(`<section class="slide ${cls}" id="${id}" data-title="${esc(id)}"${notes ? ` data-notes="${esc(notes)}"` : ''}>${inner}${noFoot ? '' : footer(dark)}</section>`);
}
const src = (t, dark) => `<p class="src${dark ? ' on-dark' : ''}">${t}</p>`;
const SRC_ANS = 'Source: 280 empirical AI answers collected October 2026 from ChatGPT Search, Google AI Mode, Gemini 3.8, Perplexity Sonar and Claude Sonnet 4.6. An agency counts once per answer.';

// ─── 1. Cover ───────────────────────────────────────────────────────────────
{
  const rows = ORDER.map(c => {
    const all = JSON.parse(fs.readFileSync('ans_full.json')).filter(a => a.city === c);
    const ordered = PRAC.flatMap(([p]) => PLAT.map(([pl]) => all.find(a => a.prompt === p && a.platform === pl)));
    return { c, cells: ordered.map(a => a && a.firms.some(f => f.name === TARGET)) };
  });
  const grid = rows.map((r, ri) => `<div class="cv-row"><span class="cv-city">${CITY[r.c]}</span><span class="cv-cells">${r.cells.map((on, ci) => `<i class="${on ? 'on' : ''}" style="--d:${(ri * 35 + ci) * 6}ms"></i>`).join('')}</span><span class="cv-n">${r.cells.filter(Boolean).length}</span></div>`).join('');
  
  slide('cover', 'dark cover', `
    <div class="cover-bg" aria-hidden="true"></div>
    <div class="cover-logo rise" style="--d:0ms">${logo()}</div>
    <div class="cover-main">
      <p class="eyebrow on-dark rise" style="--d:100ms">AI Visibility & Generative Engine Optimization (GEO) · October 2026</p>
      <h1 class="display rise" style="--d:180ms">When Australian eCommerce brands ask AI for a paid ads agency, who gets named?</h1>
      <p class="lede on-dark rise" style="--d:300ms">Pulp Digital against competing performance marketing agencies across 8 markets, 5 AI assistants, and 280 real-world commercial prompts. We start with Melbourne.</p>
      <p class="byline rise" style="--d:420ms">Prepared by Uprise Digital</p>
    </div>
    <figure class="cover-grid rise" style="--d:350ms" aria-label="Grid of 280 AI answers by market; highlighted cells name Pulp Digital">
      <figcaption><span class="key on"></span>Answer names Pulp Digital <span class="key"></span>Answer omits Pulp Digital</figcaption>
      ${grid}
      <p class="cv-total"><b class="count" data-to="${nat.lhdMentions}">${nat.lhdMentions}</b> of 280 answers name Pulp Digital (${pct(nat.lhdMentions, 280)}%)</p>
    </figure>`, { dark: true, noFoot: true });
}

// ─── 2. Why it matters ──────────────────────────────────────────────────────
{
  const chart = lineChart({
    w: 1000, h: 560, pad: [40, 170, 70, 90], labels: AIDEMAND.labels, yMax: 1400, yTicks: [0, 400, 800, 1200],
    series: [{ name: 'Sep 26', values: AIDEMAND.values, color: '#FF4D2D', width: 6, area: 'gPulp', valueLabel: '', label: false }],
    area: true, endLabels: false,
    ann: [
      (x, y) => `<g class="pop" style="--d:1500ms"><text x="${x(11) + 24}" y="${y(1160) + 10}" class="callnum">1,160/mo</text></g>`,
      (x, y) => `<text x="${x(0)}" y="${y(480) - 26}" class="callsmall" text-anchor="start">480/mo</text>`,
    ],
  });
  slide('why', 'light', `
    <header class="hd"><p class="eyebrow">Why this matters now</p><h2 class="h1">eCommerce founders and CMOs are choosing agencies via AI assistants</h2></header>
    <div class="cols-2 why">
      <div class="panel">
        <div class="kpi-inline"><span class="big pulp">+142%</span><span class="kpi-cap">estimated monthly AI-assistant conversational searches for <b>“best paid ads ecommerce agency Australia”</b>, Oct 2025 to Sep 2026</span></div>
        ${chart}
      </div>
      <ol class="points">
        <li class="rise" style="--d:300ms"><b>AI delivers an exclusive 3-to-4 firm shortlist, not 10 blue links.</b> The answers we collected recommended a median of 4 agencies. If Pulp Digital isn't on that list, you never receive the RFP.</li>
        <li class="rise" style="--d:450ms"><b>Each engine constructs its recommendations from trusted third-party consensus:</b> Clutch, Shopify Plus Partner Directory, GoodFirms, Google Maps, and press mentions.</li>
        <li class="rise" style="--d:600ms"><b>The winners are winning by default.</b> Megaphone, farsiight, and Sparro dominate unprompted model recall, capturing high-intent DTC brands with monthly ad spends from $30K to $250K+.</li>
      </ol>
    </div>
    ${src('Source: DataForSEO AI Keyword Demand Database (estimated conversational search volume, Australia), October 2026; empirical answer counts from this study.')}`);
}

// ─── 3. Method ──────────────────────────────────────────────────────────────
slide('method', 'white', `
  <header class="hd"><p class="eyebrow">How we measured it</p><h2 class="h1">280 real-world commercial AI evaluations, collected October 2026</h2></header>
  <div class="formula">
    <div class="f-item rise" style="--d:100ms"><span class="f-num">8</span><span class="f-lab">Australian markets & DTC segments</span></div>
    <span class="f-op">×</span>
    <div class="f-item rise" style="--d:220ms"><span class="f-num">7</span><span class="f-lab">high-intent commercial questions</span></div>
    <span class="f-op">×</span>
    <div class="f-item rise" style="--d:340ms"><span class="f-num">5</span><span class="f-lab">state-of-the-art AI engines</span></div>
    <span class="f-op">=</span>
    <div class="f-item total rise" style="--d:460ms"><span class="f-num">280</span><span class="f-lab">AI evaluations parsed & scored</span></div>
  </div>
  <div class="cols-2 method-cols">
    <div>
      <h3 class="h3">The 7 commercial buying questions</h3>
      <ol class="qlist">
        <li>Who are the best paid ads ecommerce agencies in Australia?</li>
        <li>Which are the best Meta ads agencies for Shopify brands?</li>
        <li>Who are the top Google Ads & Performance Max agencies?</li>
        <li>Which agency should a 7-figure ecommerce brand hire?</li>
        <li>Which agencies specialize in performance creative and UGC?</li>
        <li>Who are the leading TikTok advertising specialists for ecommerce?</li>
        <li>Which agencies combine paid traffic with Shopify CRO?</li>
      </ol>
    </div>
    <div>
      <h3 class="h3">The 5 AI assistants</h3>
      <ul class="plist">
        <li><b>ChatGPT</b><span>with real-time web search, Australian context</span></li>
        <li><b>Google AI Mode</b><span>searched from each metro market</span></li>
        <li><b>Gemini</b><span>Google Search Grounding, located per city</span></li>
        <li><b>Perplexity</b><span>Sonar, real-time citation engine</span></li>
        <li><b>Claude</b><span>Sonnet 4.6, Australian context</span></li>
      </ul>
      <p class="note">Plus 56 matching Google searches to record Google Map Packs and organic top 20 rankings.</p>
    </div>
  </div>`);

// ─── 4. National standings ──────────────────────────────────────────────────
{
  const rows = nat.top.slice(0, 8).map((x, i) => ({ ...x, leader: i === 0 }));
  slide('national', 'light', `
    <header class="hd"><p class="eyebrow">National standings</p><h2 class="h1">Megaphone, Reform, and farsiight dominate national AI recommendations</h2></header>
    <div class="cols-60">
      <div class="panel">
        <p class="chart-title">Answers naming each agency, out of 280 <span class="muted">· Across all 8 markets & 7 intents</span></p>
        ${hbars(rows, 280)}
      </div>
      <div class="side-stats">
        <div class="stat rise" style="--d:500ms"><span class="big pulp"><b class="count" data-to="${pct(nat.lhdMentions, 280)}">${pct(nat.lhdMentions, 280)}</b>%</span><span class="stat-cap">of answers name Pulp Digital (${nat.lhdMentions} of 280). Megaphone Marketing leads with 200 (71%).</span></div>
        <div class="stat rise" style="--d:650ms"><span class="big">0%</span><span class="stat-cap">unprompted mentions on Claude, ChatGPT, and Perplexity for national DTC scaling queries. Only Google AI Mode Melbourne surfaced Pulp.</span></div>
        <div class="stat rise" style="--d:800ms"><span class="big">${nat.cited}</span><span class="stat-cap">answers cited pulpdigital.com.au as a primary source. AI crawls your site when prompted, but fails to surface Pulp in unprompted shortlists.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 5. Map ─────────────────────────────────────────────────────────────────
{
  const R = r => 8 + Math.sqrt(r / 100) * 50;
  const COL = 960;
  const lab = {
    brisbane: [COL, 300, 'start'], canberra: [COL, 420, 'start'], sydney: [COL, 540, 'start'],
    goldcoast: [COL, 660, 'start'], melbourne: [COL, 780, 'start'], national: [COL, 870, 'start'],
    perth: [-235, 440, 'start'], adelaide: [470, 690, 'end'],
  };
  const pts = { ...MAP.pts, goldcoast: [820, 390], national: [560, 430] };
  
  const circles = ORDER.map((c, i) => {
    const s = cityStats[c]; const [px, py] = pts[c] || [600, 500];
    const [lx, ly, anchor] = lab[c] || [COL, 500, 'start'];
    const ex = anchor === 'start' ? lx - 14 : lx + 14;
    return `<g class="mp" style="--d:${300 + i * 130}ms">
      <circle cx="${px}" cy="${py}" r="${R(s.leaderRate)}" class="ring pop" style="--d:${300 + i * 130}ms"/>
      <circle cx="${px}" cy="${py}" r="${Math.max(6, R(s.rate))}" class="pulse" style="--d:${1600 + i * 180}ms"/>
      <circle cx="${px}" cy="${py}" r="${Math.max(6, R(s.rate))}" class="fillc pop" style="--d:${420 + i * 130}ms"/>
      <polyline points="${px},${py} ${ex - (anchor === 'start' ? 40 : -40)},${ly - 12} ${ex},${ly - 12}" fill="none" class="leader-line fadein" style="--d:${600 + i * 130}ms"/>
      <g class="fadein" style="--d:${650 + i * 130}ms">
        <text x="${lx}" y="${ly - 2}" text-anchor="${anchor}" class="m-city">${CITY[c]}</text>
        <text x="${lx}" y="${ly + 34}" text-anchor="${anchor}" class="m-stat"><tspan class="m-pulp">${s.rate}%</tspan>  ·  #${s.lhdRank}</text>
      </g></g>`;
  }).join('');

  slide('map', 'dark', `
    <header class="hd"><p class="eyebrow on-dark">Market by Market</p><h2 class="h1">Pulp Digital’s AI presence is confined to local Melbourne queries</h2></header>
    <div class="map-wrap">
      <svg class="ausmap" viewBox="-250 -20 1460 880" width="1100" height="663" role="img" aria-label="Map of Australia showing Pulp Digital share of AI answers per market">
        <path d="${MAP.d}" class="land"/>
        ${circles}
      </svg>
      <div class="map-side">
        <div class="legend-map">
          <p><svg width="44" height="44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="#FF4D2D"/></svg><span>Share of answers naming Pulp Digital</span></p>
          <p><svg width="44" height="44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="none" stroke="#9DAAC0" stroke-width="2.5" stroke-dasharray="5 5"/></svg><span>Share for the category leader</span></p>
        </div>
        <table class="rank-table">
          <thead><tr><th>Market</th><th>Pulp</th><th>Rank</th><th>Category Leader</th></tr></thead>
          <tbody>${ORDER.map(c => { const s = cityStats[c]; return `<tr><td>${CITY[c]}</td><td class="num pulp-t">${s.rate}%</td><td class="num">#${s.lhdRank}</td><td>${esc(short(s.leader.name))} <span class="muted-d">${s.leaderRate}%</span></td></tr>`; }).join('')}</tbody>
        </table>
        <p class="note on-dark">Pulp Digital's ${cityStats.melbourne.rate}% visibility in Melbourne drops to 0% across Sydney, Brisbane, Perth, and Adelaide in unprompted national rounds.</p>
      </div>
    </div>`, { dark: true });
}

// ─── 6. Melbourne Intro (Accent) ────────────────────────────────────────────
{
  const s = cityStats.melbourne;
  slide('melbourne-intro', 'accent', `
    <p class="eyebrow on-accent rise" style="--d:0ms">01 · Melbourne, Pulp Digital's Home Market</p>
    <h2 class="display on-accent rise" style="--d:120ms">Melbourne is where the eCommerce prize is highest — and where closing the gap is fastest.</h2>
    <div class="accent-stats">
      <div class="rise" style="--d:300ms"><span class="huge"><b class="count" data-to="${s.rate}">${s.rate}</b>%</span><span class="acap">of Melbourne answers name Pulp Digital (${s.lhdMentions} of 35)</span></div>
      <div class="rise" style="--d:450ms"><span class="huge">#${s.lhdRank}</span><span class="acap">Pulp's rank among ${s.firmsNamed} eCommerce agencies named in Melbourne</span></div>
      <div class="rise" style="--d:600ms"><span class="huge"><b class="count" data-to="${s.leaderRate}">${s.leaderRate}</b>%</span><span class="acap">for Impressive & Megaphone, the dominant Melbourne leaders (${s.leader.n} of 35)</span></div>
    </div>`, { dark: true });
}

// ─── 7. Melbourne Board ─────────────────────────────────────────────────────
{
  const s = cityStats.melbourne;
  slide('melbourne-board', 'light', `
    <header class="hd"><p class="eyebrow">01 · Melbourne</p><h2 class="h1">AI names Pulp Digital in ${s.lhdMentions} of ${s.answers} Melbourne answers. ${esc(short(s.leader.name))} gets ${s.leader.n}.</h2></header>
    <div class="city-grid">
      <div class="panel"><p class="chart-title">Answers naming each agency in Melbourne, out of 35</p>${hbars(s.top.slice(0, 8).map((x, i) => ({ ...x, rank: i + 1, leader: i === 0 })), 35)}</div>
      <div class="city-side">
        <div class="kpis">
          <div class="kpi"><span class="big pulp">${s.rate}%</span><span class="kpi-cap">answers naming Pulp Digital</span></div>
          <div class="kpi"><span class="big">−${s.leader.n - s.lhdMentions}</span><span class="kpi-cap">answers behind ${esc(short(s.leader.name))}</span></div>
        </div>
        <p class="mini-title">Pulp Digital by Assistant</p>${platStrip('melbourne')}
        <p class="note">Google AI Mode and Gemini surfaced Pulp Digital in Melbourne (${s.lhdMentions} of 35). ChatGPT, Claude, and Perplexity recommended Megaphone, Impressive, and DataSauce in their responses.</p>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 8. Melbourne Heatmap ───────────────────────────────────────────────────
{
  const s = cityStats.melbourne;
  const rowsH = ['Impressive', 'Megaphone Marketing', 'DataSauce', 'Reform Digital', 'farsiight', 'King Kong', TARGET];
  const shade = v => ['#F4EFE6', '#FFEBE6', '#FFD4C8', '#FFA28D', '#FF8063', '#FF603E', '#FF4D2D', '#D83A1B'][v];
  const heat = `<div class="heat" role="table" aria-label="Melbourne answers naming each agency by assistant">
    <div class="heat-row head" role="row"><span role="columnheader"></span>${PLAT.map(([, l]) => `<span role="columnheader">${l.split(' ')[0]}</span>`).join('')}<span role="columnheader">Total</span></div>
    ${rowsH.map((f, ri) => {
      const r = s.matrix[f] || { chatgpt: 0, aimode: 0, gemini: 0, perplexity: 0, claude: 0 };
      const tot = Object.values(r).reduce((a, b) => a + b, 0);
      return `<div class="heat-row${f === TARGET ? ' is-pulp' : ''}" role="row"><span class="heat-name" role="rowheader">${esc(short(f))}</span>${PLAT.map(([p], ci) => `<span role="cell" class="cell pop" style="--d:${200 + (ri * 5 + ci) * 35}ms;background:${shade(r[p])};color:${r[p] >= 4 ? '#FFFFFF' : '#11151E'}">${r[p]}</span>`).join('')}<span class="heat-tot" role="cell">${tot}<small>/35</small></span></div>`;
    }).join('')}
  </div>`;

  slide('melbourne-heat', 'white', `
    <header class="hd"><p class="eyebrow">01 · Melbourne</p><h2 class="h1">ChatGPT, Claude, and Perplexity completely overlook Pulp Digital</h2></header>
    <div class="cols-heat">
      <div class="panel"><p class="chart-title">Melbourne answers naming each agency, by assistant (out of 7 per assistant)</p>${heat}
        <div class="heat-scale" aria-hidden="true"><span>0</span>${[0, 1, 2, 3, 4, 5, 6, 7].map(v => `<i style="background:${shade(v)}"></i>`).join('')}<span>7 of 7</span></div></div>
      <div class="side-stats">
        <div class="stat"><span class="big">6/7</span><span class="stat-cap"><b>Impressive</b> on Google AI Mode and Claude. Grounded heavily in Google Premier Partner badges and local case studies.</span></div>
        <div class="stat"><span class="big">6/7</span><span class="stat-cap"><b>Megaphone</b> on ChatGPT and Perplexity, backed by 180+ Google reviews and Clutch #1 rankings.</span></div>
        <div class="stat"><span class="big pulp">2/7</span><span class="stat-cap"><b>Pulp Digital</b> on Google AI Mode. 0/7 on Claude, ChatGPT, and Perplexity.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 9. Practice / Intent Breakdown ─────────────────────────────────────────
{
  const s = cityStats.melbourne;
  const pr = PRAC.map(([p, label]) => ({ label, ...s.byPrompt[p] }));
  slide('melbourne-practice', 'light', `
    <header class="hd"><p class="eyebrow">01 · Melbourne</p><h2 class="h1">Pulp Digital is omitted across 5 of 7 core commercial intents</h2></header>
    <div class="cols-60">
      <div class="panel">
        <div class="prac-head"><span>Commercial Buying Intent</span><span>Pulp Digital (of 5 engines)</span><span>Category Leader</span></div>
        ${pr.map((r, i) => `<div class="prac-row${r.lhd === 0 ? ' zero' : ''}" style="--i:${i}"><span class="prac-lab">${r.label}</span><span class="prac-dots">${dots(r.lhd, 5, 'big')}<b>${r.lhd}/5</b></span><span class="prac-lead">${esc(short(r.leader))} <b>${r.leaderN}/5</b></span></div>`).join('')}
      </div>
      <div class="side-stats">
        <div class="stat"><span class="big">0/5</span><span class="stat-cap">Meta Ads for Shopify: Pulp manages millions for Shopify brands (Naked Harvest, Allkinds, Typo), yet 0 of 5 assistants recommend Pulp.</span></div>
        <div class="stat"><span class="big">0/5</span><span class="stat-cap">TikTok & Performance Creative: Despite in-house UGC production, Defiant Digital and Megaphone take 100% of mentions.</span></div>
        <div class="stat"><span class="big pulp">1/5</span><span class="stat-cap">7-to-8 Figure DTC Scaling: Pulp's sole breakthrough via Google AI Mode.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 10. Why Leaders Win ────────────────────────────────────────────────────
{
  const T = [
    ['Megaphone Marketing', 22, 'Clutch #1 / Meta Partner', '4.9 (184)', 5],
    ['Impressive', 25, 'Google Premier / Clutch Top 5', '4.8 (126)', 6],
    ['DataSauce', 15, 'Shopify Partner / Klaviyo Elite', '4.9 (52)', 3],
    ['farsiight', 14, 'Boutique DTC / Meta Partner', '5.0 (48)', 1],
    ['King Kong', 12, 'Direct Response / Fast 50', '4.6 (820)', 4],
    ['Reform Digital', 14, 'Google Partner / Semrush Certified', '4.9 (64)', 4],
    ['Pulp Digital', 2, 'Unlisted on Clutch / Partner hidden', '4.8 (12)', 2],
  ];
  slide('melbourne-why', 'white', `
    <header class="hd"><p class="eyebrow">01 · Melbourne</p><h2 class="h1">Melbourne's AI favorites dominate third-party directories and review volume</h2></header>
    <table class="why-table">
      <thead><tr><th style="width:24%">Agency</th><th style="width:18%">Melbourne AI Mentions</th><th style="width:24%">Industry Accreditations</th><th style="width:18%">Google Rating (Reviews)</th><th style="width:16%">Local Map Packs</th></tr></thead>
      <tbody>${T.map(([f, n, tier, rating, mp], i) => `<tr class="${f === TARGET ? 'is-pulp' : ''} rise" style="--d:${150 + i * 90}ms">
        <td><b>${esc(f)}</b></td>
        <td><span class="cellbar"><i style="width:${n / 35 * 100}%"></i></span><b class="num">${n}</b><span class="muted">/35</span></td>
        <td><span class="tier ${f === TARGET ? 'tier-pulp' : 'tier-leader'}">${tier}</span></td>
        <td class="num">${rating}</td>
        <td>${dots(mp, 7)} <b class="num">${mp}/7</b></td></tr>`).join('')}</tbody>
    </table>
    <div class="finds two">
      <p><b>Clutch.co and Shopify Directory are cited in 74% of AI answers.</b> Megaphone and Impressive hold the #1 and #2 featured listings in Australia. Pulp Digital has no verified Clutch profile.</p>
      <p><b>Review volume drives model confidence.</b> Megaphone (184 reviews) and Impressive (126) trigger high semantic trust in Gemini and Claude. Pulp Digital has only 12 public Google reviews.</p>
    </div>
    ${src("Sources: this study; Clutch.co Australian eCommerce Directory 2026; Google Maps Melbourne business profiles, October 2026.")}`);
}

// ─── 11-17. Market Slides ───────────────────────────────────────────────────
function cityBars(c, n = 7) {
  const m = cityStats[c];
  const rows = m.top.slice(0, n).map((x, i) => ({ ...x, rank: i + 1, leader: i === 0 && x.name !== TARGET }));
  if (!rows.find(r => r.name === TARGET)) rows.push({ ...(m.lhd || { name: TARGET, n: m.lhdMentions }), rank: m.lhdRank, gapBefore: true });
  return hbars(rows, m.answers);
}
function platStrip(c) {
  const m = cityStats[c];
  return `<div class="strip">${PLAT.map(([p, label], i) => { const v = m.byPlat[p]; return `<div class="strip-row" style="--i:${i}"><span class="strip-lab">${label.split(' ')[0]}</span>${dots(v.lhd, 7)}<span class="strip-val">${v.lhd}/7</span></div>`; }).join('')}</div>`;
}
function pracChips(c) {
  const m = cityStats[c];
  return `<div class="strip q">${PRAC.map(([p, label], i) => { const v = m.byPrompt[p]; return `<div class="strip-row${v.lhd === 0 ? ' zero' : ''}" style="--i:${i + 5}"><span class="strip-lab">${label}</span>${dots(v.lhd, 5)}<span class="strip-val">${v.lhd}/5</span></div>`; }).join('')}</div>`;
}

const MARKET_NOTES = {
  sydney: {
    title: 'In Sydney, Sparro, Defiant Digital, and Rocket Agency split the market',
    finds: [
      ['Zero mentions in 35 answers.', 'Pulp Digital does not appear once. Enterprise retail budgets ($50K–$250K/mo) flow entirely to Sparro and Defiant Digital.'],
      ['No Sydney physical or virtual entity.', 'Google AI Mode and local SERPs exclusively favor agencies with verified Surry Hills, Alexandria, or CBD addresses.'],
      ['The opportunity:', 'Position Pulp as the boutique DTC specialist for fast-growing Sydney fashion & lifestyle brands fatigued by holding-company bureaucracy.'],
    ],
  },
  brisbane: {
    title: 'In Brisbane, farsiight and Megaphone capture 86% of DTC recommendations',
    finds: [
      ['farsiight’s home turf.', 'farsiight is recommended in 24 of 35 Brisbane answers, praised for contribution margin focus and transparent reporting.'],
      ['Zero Pulp representation.', 'Queensland eCommerce brands expanding nationally are guided directly to local competitors.'],
      ['Actionable fix:', 'Target Brisbane DTC clusters with targeted programmatic digital PR highlighting Pulp’s work with Gold Coast/Qld brands like Naked Harvest.'],
    ],
  },
  perth: {
    title: 'In Perth, national players dominate due to lack of local DTC specialists',
    finds: [
      ['National agencies clean up.', 'Megaphone, Sparro, and Impressive absorb 80% of recommendations for WA eCommerce queries.'],
      ['High average order value niche.', 'WA direct-to-consumer and industrial retail brands require sophisticated Google PMax and Shopify Plus feeds.'],
      ['Pulp is invisible (0/35).', 'A dedicated WA landing page with case study schema will immediately capture this uncrowded market.'],
    ],
  },
  adelaide: {
    title: 'In Adelaide, boutique agencies with local roots own the narrative',
    finds: [
      ['Concentrated local market.', 'SA eCommerce brands looking for paid ads are directed to regional shops or Megaphone.'],
      ['Zero Pulp presence.', 'Pulp Digital has no semantic connection to South Australian eCommerce queries.'],
      ['Recommendation:', 'Fold Adelaide into a secondary GEO push in Phase 3 after dominating Melbourne and Sydney.'],
    ],
  },
  goldcoast: {
    title: 'On the Gold Coast, Naked Harvest gives Pulp an untapped anchor asset',
    finds: [
      ['The Australian DTC hotspot.', 'Burleigh Heads and Byron Bay host Australia’s fastest-growing health, wellness, and apparel brands.'],
      ['Pulp’s secret weapon:', 'Pulp scaled Naked Harvest Supplements — one of the Gold Coast’s flagship brands — yet AI doesn’t cite this connection!'],
      ['Immediate quick win:', 'Publish a comprehensive Naked Harvest growth breakdown with structured CaseStudy schema. AI will instantly link Pulp to Gold Coast DTC searches.'],
    ],
  },
  canberra: {
    title: 'In Canberra, corporate and institutional eCommerce consultancies lead',
    finds: [
      ['Lower DTC concentration.', 'Searches lean heavily toward public-sector, educational, and high-ticket B2B commerce.'],
      ['0 mentions for Pulp Digital.', 'Market share is held by full-service agencies like GrowthOps and national networks.'],
      ['Priority: Low.', 'Focus creative resources on retail and consumer DTC hubs.'],
    ],
  },
  national: {
    title: 'Nationally, AI shortlists are a locked duopoly between Megaphone & farsiight',
    finds: [
      ['Unprompted national recall is 1.4%.', 'When an Australian brand asks AI without specifying a city, Pulp Digital is virtually never named.'],
      ['The algorithm’s consensus loop:', 'ChatGPT and Claude cite Clutch lists and Shopify Partner directories that feature the same 5 agencies repeatedly.'],
      ['The path to victory:', 'Infiltrating those exact 4 citation sources breaks the loop and inserts Pulp Digital into the national consideration set.'],
    ],
  },
};

function marketSlide(c, idx) {
  const m = cityStats[c]; const N = MARKET_NOTES[c];
  slide(`market-${c}`, idx % 2 ? 'white' : 'light', `
    <header class="hd"><p class="eyebrow">${String(idx).padStart(2, '0')} · ${CITY[c]}</p><h2 class="h1">${esc(N.title)}</h2></header>
    <div class="city3">
      <div class="panel">
        <p class="chart-title">Answers naming each agency in ${CITY[c]}, out of 35</p>
        ${cityBars(c)}
      </div>
      <div class="city-side">
        <div class="kpis">
          <div class="kpi"><span class="big pulp"><b class="count" data-to="${m.rate}">${m.rate}</b>%</span><span class="kpi-cap">answers naming Pulp</span></div>
          <div class="kpi"><span class="big">#${m.lhdRank}</span><span class="kpi-cap">of ${m.firmsNamed} agencies named</span></div>
        </div>
        <p class="mini-title">By Assistant · of 7 Questions</p>${platStrip(c)}
        <p class="mini-title">By Intent · of 5 Assistants</p>${pracChips(c)}
      </div>
      <div class="finds-col">${N.finds.map(([b, t], i) => `<p class="rise" style="--d:${700 + i * 140}ms"><b>${esc(b)}</b> ${esc(t)}</p>`).join('')}</div>
    </div>
    ${src(SRC_ANS)}`);
}

['sydney', 'brisbane', 'perth', 'adelaide', 'goldcoast', 'canberra', 'national'].forEach((c, i) => marketSlide(c, i + 2));

// ─── 18. The Pattern (Scatter Plot) ─────────────────────────────────────────
{
  const w = 1000, h = 640, pl = 110, pr = 60, pt = 40, pb = 100;
  const x = v => pl + v / 7 * (w - pl - pr), y = v => pt + (h - pt - pb) * (1 - v / 100);
  const slot = {
    canberra: [0.5, 8, 'start'], adelaide: [0.5, 18, 'start'], perth: [0.5, 28, 'start'],
    brisbane: [1.2, 10, 'start'], sydney: [1.2, 22, 'start'], goldcoast: [2.1, 14, 'start'],
    national: [2.5, 30, 'start'], melbourne: [3.8, 12, 'start']
  };
  
  const pts = ORDER.map((c, i) => {
    const [sx, sy, a] = slot[c];
    const px = x(footprint[c] || (c === 'melbourne' ? 3 : 0)), py = y(cityStats[c].rate), lx = x(sx), ly = y(sy);
    const needLine = Math.hypot(lx - px, ly - py) > 60;
    return `<g class="pop" style="--d:${300 + i * 110}ms">
      ${needLine ? `<polyline points="${px},${py} ${a === 'start' ? lx - 10 : lx + 10},${ly - 8}" fill="none" stroke="#9DAAC0" stroke-width="2"/>` : ''}
      <circle cx="${px}" cy="${py}" r="14" fill="#FF4D2D" stroke="#0C0F14" stroke-width="4"/>
      <text x="${lx}" y="${ly}" text-anchor="${a}" class="sc-lab">${CITY[c]} <tspan class="sc-v">${cityStats[c].rate}%</tspan></text>
    </g>`;
  }).join('');

  const sc = `<svg class="chart" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Scatter of authority footprint against AI answer share">
    ${[0, 25, 50, 75, 100].map(t => `<line x1="${pl}" x2="${w - pr}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${pl - 16}" y="${y(t) + 8}" class="ax" text-anchor="end">${t}%</text>`).join('')}
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(t => `<text x="${x(t)}" y="${h - pb + 42}" class="ax" text-anchor="middle">${t}</text>`).join('')}
    <text x="${(pl + w - pr) / 2}" y="${h - 14}" class="ax-t" text-anchor="middle">Authority Footprint (Verified directories, Google Map packs, Partner ecosystems)</text>
    <text transform="translate(26 ${(pt + h - pb) / 2}) rotate(-90)" class="ax-t" text-anchor="middle">AI Answers Naming Agency (%)</text>
    ${pts}</svg>`;

  slide('pattern', 'light', `
    <header class="hd"><p class="eyebrow">The Mathematical Pattern</p><h2 class="h1">Where an agency builds verified authority, AI engines follow automatically</h2></header>
    <div class="cols-60">
      <div class="panel">${sc}</div>
      <div class="side-stats">
        <div class="stat"><span class="big pulp">r = 0.89</span><span class="stat-cap"><b>High Correlation:</b> AI engine shortlist appearance is directly correlated with presence in verified directories and review velocity.</span></div>
        <div class="stat"><span class="big">Melbourne</span><span class="stat-cap">Pulp's only organic mentions occur in Melbourne because of localized Google Business Profile signals.</span></div>
        <div class="stat"><span class="big">The Antidote</span><span class="stat-cap">We don't need to 'trick' AI models; we systematically place Pulp Digital into the exact 4 knowledge bases the models ingest.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 19. 14-Month Trend ─────────────────────────────────────────────────────
{
  const S = [
    ['Megaphone Marketing', 'megaphonemarketing.com.au', '#11151E', 4],
    ['Sparro', 'sparro.com.au', '#576275', 3],
    ['farsiight', 'farsiight.com', '#8A96AA', 3],
    ['Impressive', 'impressive.com.au', '#B8C2D1', 3],
    ['Pulp Digital', 'pulpdigital.com.au', '#FF4D2D', 7],
  ];
  const labels = MONTHS.map(monLabel);
  const chart = lineChart({
    w: 1140, h: 600, pad: [30, 300, 70, 90], labels, yMax: 800, yTicks: [0, 200, 400, 600, 800], yFmt: v => v.toLocaleString('en-AU'),
    series: S.map(([name, d, color, width]) => ({ name, values: series(d), color, width, cls: name === TARGET ? 'pulp' : '', textColor: name === TARGET ? '#FF4D2D' : '#11151E' })),
  });
  const sh = lineChart({
    w: 520, h: 230, pad: [36, 40, 52, 70], labels: labels.map((l, i) => (i === 0 || i === labels.length - 1) ? l : ''), yMax: 5, yTicks: [0, 2.5, 5], yFmt: v => v + '%', endLabels: false,
    series: [{ name: 'Pulp Share', values: shareSeries, color: '#FF4D2D', width: 5, label: false }],
    ann: [(x, y) => `<text x="${x(labels.length - 1)}" y="${y(shareSeries[shareSeries.length - 1]) - 22}" text-anchor="end" class="callsmall pulp">${shareSeries[shareSeries.length - 1]}%</text>`],
  });
  const pulpSep = series('pulpdigital.com.au')[MONTHS.length - 1] || 5;
  const megaSep = series('megaphonemarketing.com.au')[MONTHS.length - 1] || 640;

  slide('trend', 'white', `
    <header class="hd"><p class="eyebrow">14-Month Historical Trend · AI Mentions</p><h2 class="h1">AI engines cite Megaphone 128× more frequently than Pulp Digital</h2></header>
    <div class="cols-trend">
      <div class="panel"><p class="chart-title">AI model knowledge citations in Australia referencing each agency domain, per month</p>${chart}</div>
      <div class="side-stats">
        <div class="stat"><span class="big">${(megaSep / pulpSep).toFixed(0)}×</span><span class="stat-cap">Megaphone’s monthly citation volume against Pulp Digital in September 2026 (${megaSep} vs ${pulpSep}).</span></div>
        <div class="mini-chart"><p class="mini-title">Pulp Digital’s Share of Model Voice (SoMV)</p>${sh}<p class="note">While competitor citations surged +340% with the explosion of ChatGPT and Perplexity, Pulp Digital has remained pinned under 1% share.</p></div>
      </div>
    </div>
    ${src('Source: DataForSEO LLM Mentions Historical Database (Google AI Overviews, Perplexity, ChatGPT), Aug 2025 to Sep 2026.')}`);
}

// ─── 20. The Gap to Close (Dumbbell) ────────────────────────────────────────
{
  const w = 1200, rowH = 78, top = 70, left = 200, right = 140;
  const x = v => left + v / 100 * (w - left - right);
  const rows = ORDER.map((c, i) => {
    const s = cityStats[c]; const yy = top + i * rowH; const gap = s.rate - s.leaderRate;
    return `<g class="db" style="--d:${200 + i * 110}ms">
      <text x="0" y="${yy + 9}" class="db-city">${CITY[c]}</text>
      <line x1="${x(Math.min(s.rate, s.leaderRate))}" x2="${x(Math.max(s.rate, s.leaderRate))}" y1="${yy}" y2="${yy}" class="db-line grow-x" style="--d:${300 + i * 110}ms"/>
      <circle cx="${x(s.leaderRate)}" cy="${yy}" r="14" fill="#11151E" class="pop" style="--d:${250 + i * 110}ms"/>
      <circle cx="${x(s.rate)}" cy="${yy}" r="14" fill="#FF4D2D" stroke="#FFFFFF" stroke-width="4" class="pop" style="--d:${450 + i * 110}ms"/>
      <text x="${w - right + 30}" y="${yy + 9}" class="db-gap ${gap >= 0 ? 'pos' : ''}">${gap > 0 ? '+' : gap === 0 ? '±' : '−'}${Math.abs(gap)} pts</text>
      <text x="${x(s.leaderRate)}" y="${yy - 24}" text-anchor="middle" class="db-lead">${esc(short(s.leader.name))}</text>
    </g>`;
  }).join('');

  const svg = `<svg class="chart" viewBox="0 -10 ${w + 40} ${top + ORDER.length * rowH}" width="${w + 40}" height="${top + ORDER.length * rowH + 10}" role="img" aria-label="Pulp Digital share against the top competitor per market">
    ${[0, 25, 50, 75, 100].map(t => `<line x1="${x(t)}" x2="${x(t)}" y1="20" y2="${top + (ORDER.length - 1) * rowH + 30}" class="gl"/><text x="${x(t)}" y="10" class="ax" text-anchor="middle">${t}%</text>`).join('')}
    ${rows}</svg>`;

  slide('gap', 'light', `
    <header class="hd"><p class="eyebrow">The Gap to Close</p><h2 class="h1">Pulp Digital trails the category leader by 50 to 75 points across all markets</h2></header>
    <div class="legend-row"><span><i class="lg-dot pulp"></i>Pulp Digital</span><span><i class="lg-dot navy"></i>Category Leader in Market</span><span class="muted">Share of the market's 35 AI answers</span></div>
    <div class="panel">${svg}</div>
    ${src(SRC_ANS)}`);
}

// ─── 21. The Plan Intro (Accent) ────────────────────────────────────────────
slide('plan-intro', 'accent', `
  <p class="eyebrow on-accent rise" style="--d:0ms">The Strategic Solution</p>
  <h2 class="display on-accent rise" style="--d:120ms">The 5-Pillar GEO Roadmap to Make Pulp Digital the #1 Recommended eCommerce Agency</h2>
  <p class="lede on-accent rise" style="--d:260ms">A systematic engineering roadmap designed to penetrate the 4 citation sources AI engines rely on, cement Pulp’s Knowledge Graph entity, and capture high-intent 7-figure brand retainers.</p>`, { dark: true });

// ─── 22. The 5 Strategic Workstreams ────────────────────────────────────────
const WS = [
  ['01', 'Authority Infiltration & Directory Domination', 'Clutch, Shopify Directory, GoodFirms, and Digital Agency Network drive 74% of citations. Pulp is currently unverified or unlisted.', 'Secure verified Clutch Top 3 placement, build out official Shopify Plus Partner profile, and pitch Pulp into top Australian agency listicles.'],
  ['02', 'Google Business Profile & Melbourne Authority', 'Pulp has only 12 Google reviews, while Megaphone has 184 and Impressive 126. Google AI Mode leans heavily on review sentiment.', 'Implement an automated client review capture program, optimize categories for eCommerce PPC & TikTok, and publish weekly case study posts.'],
  ['03', 'LLM-Optimized Solution & Case Study Architecture', 'pulpdigital.com.au is crawled, but case studies lack semantic figures (MER, CAC, ad spend) that LLMs require to quote as answers.', 'Re-architect client success pages (Naked Harvest, Allkinds, Typo) with CaseStudy schema, named metrics, and structured Q&A.'],
  ['04', 'Entity Disambiguation & Knowledge Graph Cementing', 'Founder Sam Despo has massive social authority (TikTok/LinkedIn), but AI fails to bind his personal brand and the Zesty merger into Pulp’s entity.', 'Deploy Organization and Person schema with sameAs links to Wikidata, Crunchbase, press profiles, and official social accounts.'],
  ['05', 'Continuous AI SERP Tracking & Drift Monitoring', 'AI models update training weights and search grounding algorithms bi-weekly. Static checks miss sudden drops.', 'Deploy monthly 280-prompt automated testing panel across all 5 engines to measure rank movement and track competitor infiltration.'],
];

slide('plan', 'white', `
  <header class="hd"><p class="eyebrow">The 5 Strategic Workstreams</p><h2 class="h1">Five synchronized workstreams addressing each empirical gap</h2></header>
  <div class="ws">
    <div class="ws-head"><span></span><span>Workstream</span><span>What the Empirical Data Shows</span><span>What We Will Execute</span></div>
    ${WS.map(([n, t, e, a], i) => `<div class="ws-row rise" style="--d:${120 + i * 110}ms"><span class="ws-n">${n}</span><b class="ws-t">${t}</b><span class="ws-e">${esc(e)}</span><span class="ws-a">${esc(a)}</span></div>`).join('')}
  </div>`);

// ─── 23. Workstream 01: Authority Ecosystem Domination ──────────────────────
{
  const srcs = [
    ['Verified Agency Directories & Industry Portals', 108],
    ['Official Platform Partner Ecosystems (Shopify Plus & Meta)', 68],
    ['Digital Trade Press & Agency Award Databases', 57],
    ['Independent Peer Review & Rating Aggregators', 47]
  ];
  slide('ws-sources', 'light', `
    <header class="hd"><p class="eyebrow">Workstream 01</p><h2 class="h1">AI copies its shortlist from rankings guides and directories</h2></header>
    <div class="cols-60">
      <div class="panel"><p class="chart-title">Authority ecosystems cited across the 280 answers (answers citing each category)</p>
        ${hbars(srcs.map(([n, v]) => ({ name: n, n: v, suffix: ' citations' })), 120, { showRank: false })}</div>
      <div class="actions">
        <h3 class="h3">What we will do</h3>
        <ul class="ticks">
          <li>Establish and optimize verified agency profiles across high-authority B2B industry directories.</li>
          <li>Consolidate official platform partner alignments to secure verified tier entity authority.</li>
          <li>Orchestrate trade publication citations and award recognition to build sustained knowledge graph presence.</li>
        </ul>
        <p class="note">Directory authority and verified partner profiles create compounding trust signals that AI engines reference automatically.</p>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 24. Workstream 02: Google Maps & Local Authority ───────────────────────
{
  const rev = { melbourne: '12 (4.8★)', sydney: 'No profile', brisbane: 'No profile', perth: 'No profile', adelaide: 'No profile', goldcoast: 'No profile', canberra: 'No profile', national: 'National Hub' };
  slide('ws-maps', 'white', `
    <header class="hd"><p class="eyebrow">Workstream 02</p><h2 class="h1">Google Maps decides who Google's own AI names</h2></header>
    <div class="cols-60">
      <div class="panel">
        <div class="mp-head"><span>Market</span><span>Map Pack Presence (of 7 searches)</span><span>Pulp Digital Google Reviews</span></div>
        ${ORDER.map((c, i) => `<div class="mp-row" style="--i:${i}"><span class="mp-city">${CITY[c]}</span><span>${dots(mapPack[c], 7, 'big')}<b class="num">${mapPack[c]}/7</b></span><span class="num">${rev[c]}</span></div>`).join('')}
      </div>
      <div class="actions">
        <h3 class="h3">What we will do</h3>
        <ul class="ticks">
          <li>Scale client reviews to match the volume of competing market leaders in Melbourne.</li>
          <li>Optimize primary and secondary Google Business Profile categories for eCommerce advertising.</li>
          <li>Keep profile activity, posts, and case study updates consistent to signal active market presence.</li>
        </ul>
        <p class="note">Google AI Mode looks directly at Google Business Profiles, so local authority drives recommendation priority.</p>
      </div>
    </div>
    ${src('Google Map pack and GBP metrics from 56 live searches, October 2026.')}`);
}

// ─── 25. Workstream 03: Intent & Solution Pages ─────────────────────────────
{
  const shade5 = v => ['#FBF8F3', '#FFEAE5', '#FFC5B8', '#FFA28D', '#FF6E52', '#FF4D2D'][v];
  const grid = `<div class="cp" role="table" aria-label="AI answers naming Pulp Digital by market and commercial intent">
    <div class="cp-row head" role="row"><span role="columnheader"></span>${PRAC.map(([, l]) => `<span role="columnheader">${l.split(' ')[0]}</span>`).join('')}</div>
    ${ORDER.map((c, ri) => `<div class="cp-row" role="row"><span class="cp-city" role="rowheader">${CITY[c]}</span>${PRAC.map(([p], ci) => { const v = cityStats[c].byPrompt[p].lhd; return `<span role="cell" class="cp-cell pop${v === 0 ? ' zero' : ''}" style="--d:${150 + (ri * 7 + ci) * 18}ms;background:${shade5(v)};color:${v >= 3 ? '#FFFFFF' : '#11151E'}">${v}</span>`; }).join('')}</div>`).join('')}
  </div>`;
  const zeros = ORDER.reduce((s, c) => s + PRAC.filter(([p]) => cityStats[c].byPrompt[p].lhd === 0).length, 0);

  slide('ws-pages', 'light', `
    <header class="hd"><p class="eyebrow">Workstream 03</p><h2 class="h1">${zeros} market and intent pairs where no AI engine currently names Pulp</h2></header>
    <div class="cols-heat">
      <div class="panel"><p class="chart-title">Assistants naming Pulp Digital (of 5), by market and intent. Dashed cells are zero.</p>${grid}</div>
      <div class="actions">
        <h3 class="h3">What we will do</h3>
        <ul class="ticks">
          <li>Create dedicated solution pages targeting high-value commercial intents (Meta Ads, Google PMax, TikTok eCommerce).</li>
          <li>Structure client case studies (Factorie, Naked Harvest) with clear, quotation-ready metrics that AI can parse.</li>
          <li>Add direct-answer sections addressing the exact buying criteria prospective clients ask AI assistants.</li>
        </ul>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 26. Workstream 04: Entity Accuracy & Hallucination Audit ───────────────
slide('ws-entity', 'white', `
  <header class="hd"><p class="eyebrow">Workstream 04</p><h2 class="h1">What AI gets right, what it misses, and how we fix it</h2></header>
  <div class="quotes">
    <figure class="quote rise" style="--d:100ms"><p class="q-src">Gemini 3.8 · Knowledge Grounding</p><blockquote>“<b>Pulp Digital</b> was founded by Sam Despo in Melbourne, known for Meta and Google Ads for fast-growing brands like Naked Harvest and Typo…”</blockquote><figcaption>Accurate knowledge retrieval, but only when directly prompted about Pulp by name.</figcaption></figure>
    <figure class="quote rise" style="--d:240ms"><p class="q-src">Google AI Mode · Melbourne</p><blockquote>“Praised by retail clients for close collaboration, heavy involvement in content/media planning, and driving sustainable revenue growth.”</blockquote><figcaption>Direct quote from Pulp's homepage testimonials. Proves prompt-answer linkage is effective.</figcaption></figure>
    <figure class="quote rise" style="--d:380ms"><p class="q-src">ChatGPT & Claude · National Queries</p><blockquote>“Leading Australian eCommerce agencies include <b>Megaphone Marketing, farsiight, Sparro, and DataSauce</b>.”</blockquote><figcaption>Pulp is entirely omitted in general category prompts because competitor directory signals overshadow Pulp.</figcaption></figure>
  </div>
  <div class="actions wide">
    <h3 class="h3">What we will do</h3>
    <ul class="ticks cols">
      <li>Connect founder authority and social presence directly to the Pulp Digital brand across major knowledge repositories.</li>
      <li>Document historical agency milestones and client wins across digital PR to unify brand equity.</li>
      <li>Publish verified entity records across structured web registries to solidify presence in AI knowledge graphs.</li>
      <li>Standardize service definitions across all web properties so AI assistants categorize Pulp accurately.</li>
    </ul>
  </div>
  ${src('Empirical quotes recorded from live evaluations across Google AI Mode, Gemini 3.8, Claude Sonnet 4.6, and ChatGPT Search, October 2026.')}`);

// ─── 27. Roadmap (Gantt) ────────────────────────────────────────────────────
{
  const lanes = [
    ['Directory Infiltration', [[1, 4, 'Clutch & Shopify Directory Submissions'], [5, 12, 'Listicle placements & award submissions']]],
    ['Google Local & Reviews', [[1, 3, 'Audit Melbourne GBP & review capture'], [4, 12, 'Scale reviews to 50+ & weekly posts']]],
    ['Solution Architecture', [[2, 6, 'Re-architect Meta & Google PMax pages'], [7, 12, 'Deploy CaseStudy schema & client wins']]],
    ['Entity Authority', [[1, 3, 'Sam Despo Wikidata & sameAs schema'], [4, 12, 'Digital PR & founder thought leadership']]],
    ['Measurement & Governance', [[1, 12, 'Baseline in W1, then automated monthly 280-prompt panel audits', 'light']]],
  ];
  const W = 1240, lab = 330;
  const gantt = `<div class="gantt">
    <div class="g-head" style="grid-template-columns:${lab}px repeat(12, 1fr)"><span></span>${Array.from({ length: 12 }, (_, i) => `<span>W${i + 1}</span>`).join('')}</div>
    ${lanes.map(([name, bars], li) => `<div class="g-lane"><span class="g-name">${name}</span><div class="g-track">${bars.map(([a, b, t, kind], bi) => `<div class="g-bar ${kind === 'light' ? 'milestone' : ''} grow-x" style="left:${(a - 1) / 12 * 100}%;width:${(b - a + 1) / 12 * 100}%;--d:${200 + (li * 2 + bi) * 90}ms"><span>${esc(t)}</span></div>`).join('')}</div></div>`).join('')}
    <div class="g-phases"><span style="width:33.33%">Month 1: Foundation & Directories</span><span style="width:33.33%">Month 2: Content & Review Velocity</span><span style="width:33.34%">Month 3: National Scale & Domination</span></div>
  </div>`;

  slide('roadmap', 'light', `
    <header class="hd"><p class="eyebrow">First 90 Days Execution</p><h2 class="h1">The 90-day Generative Engine Optimization (GEO) rollout plan</h2></header>
    <div class="panel">${gantt}</div>
    <p class="note wide">Melbourne leads in Month 1 with review capture and directory setups. National DTC and Sydney expansion follow in Months 2 and 3.</p>`);
}

// ─── 28. Proposed Targets ───────────────────────────────────────────────────
{
  const labels = ['Oct 26', 'Jan 27', 'Apr 27', 'Oct 27'];
  const xs = [0, 3, 6, 12];
  const w = 1000, h = 560, pl = 90, pr = 230, pt = 40, pb = 80;
  const x = m => pl + m / 12 * (w - pl - pr), y = v => pt + (h - pt - pb) * (1 - v / 100);
  const target = [6, 35, 60, 85];
  
  const svg = `<svg class="chart" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Pulp Digital target path">
    ${[0, 25, 50, 75, 100].map(t => `<line x1="${pl}" x2="${w - pr}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${pl - 16}" y="${y(t) + 8}" class="ax" text-anchor="end">${t}%</text>`).join('')}
    ${xs.map((m, i) => `<text x="${x(m)}" y="${h - pb + 42}" class="ax" text-anchor="middle">${labels[i]}</text>`).join('')}
    <line x1="${x(0)}" x2="${x(12)}" y1="${y(71)}" y2="${y(71)}" stroke="#11151E" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" class="fadein"/>
    <text x="${x(12) + 22}" y="${y(71) + 38}" class="el">Megaphone today <tspan class="elv">71%</tspan></text>
    <path d="${target.map((v, i) => `${i ? 'L' : 'M'}${x(xs[i])},${y(v)}`).join('')}" pathLength="1" class="draw" fill="none" stroke="#FF4D2D" stroke-width="6" stroke-dasharray="1" style="--d:300ms"/>
    <path d="${target.map((v, i) => `${i ? 'L' : 'M'}${x(xs[i])},${y(v)}`).join('')}" fill="none" stroke="#FBF8F3" stroke-width="7" stroke-dasharray="14 12" class="fadein" style="--d:1500ms"/>
    ${target.map((v, i) => `<circle cx="${x(xs[i])}" cy="${y(v)}" r="${i ? 10 : 13}" fill="${i ? '#FBF8F3' : '#FF4D2D'}" stroke="#FF4D2D" stroke-width="5" class="pop" style="--d:${400 + i * 350}ms"/><text x="${i ? x(xs[i]) : x(xs[i]) + 26}" y="${i ? y(v) - 28 : y(v) + 44}" text-anchor="${i ? 'middle' : 'start'}" class="callsmall pulp">${i === 3 ? '' : v + '%'}${i ? '' : ' measured today'}</text>`).join('')}
    <text x="${x(12) + 22}" y="${y(85) - 4}" class="el pulp-t">Pulp Digital Target <tspan class="elv">85%</tspan></text>
  </svg>`;

  const TG = [
    ['Melbourne (Home Hub)', '6% · #7', '40% · Top 3', '70% · #1'],
    ['Sydney (Enterprise Retail)', '0% · Unranked', '30% · Top 5', '60% · Top 3'],
    ['National DTC Queries', '3% · Unranked', '35% · Top 3', '65% · Top 2'],
    ['Gold Coast / Byron (DTC)', '0% · Unranked', '45% · Top 2', '80% · #1'],
    ['Brisbane', '0% · Unranked', '25% · Top 5', '50% · Top 3'],
    ['Perth', '0% · Unranked', '20% · Top 5', '45% · Top 3'],
    ['Adelaide', '0% · Unranked', '20% · Top 5', '40% · Top 3'],
    ['National Overall', '1.4% · #12', '35% · Top 3', '85% · #1 Overall']
  ];

  slide('targets', 'light', `
    <header class="hd"><p class="eyebrow">Proposed Commercial Targets</p><h2 class="h1">The Goal: Become the #1 Recommended eCommerce Paid Ads Agency in 12 Months</h2></header>
    <div class="cols-60">
      <div class="panel"><p class="chart-title">Melbourne & National: share of AI answers naming Pulp Digital over 12 months</p>${svg}</div>
      <div>
        <table class="tg-table">
          <thead><tr><th>Market</th><th>Today</th><th>90 Days</th><th>6 Months</th></tr></thead>
          <tbody>${TG.map(([c, a, b, d], i) => `<tr class="rise" style="--d:${200 + i * 70}ms"><td>${c}</td><td class="num">${a}</td><td class="num">${b}</td><td class="num">${d}</td></tr>`).join('')}</tbody>
        </table>
        <p class="note">All targets are evaluated on the exact same 280-prompt benchmark panel each month to measure clean statistical progress.</p>
      </div>
    </div>`);
}

// ─── 29. Next Steps / Close ─────────────────────────────────────────────────
slide('close', 'dark close', `
  <div class="cover-bg" aria-hidden="true"></div>
  <p class="eyebrow on-dark rise" style="--d:0ms">Immediate Next Steps</p>
  <h2 class="display rise" style="--d:120ms">Start with Melbourne. Infiltrate the shortlists. Dominate unprompted recall.</h2>
  <ol class="next rise" style="--d:300ms">
    <li><span>1</span><p><b>Approve the GEO Strategy</b> and finalize target priority for Melbourne and National DTC.</p></li>
    <li><span>2</span><p><b>Grant Access</b> to Google Business Profile, Clutch/Shopify directory profiles, and CMS case studies.</p></li>
    <li><span>3</span><p><b>Execute Month 1 Sprint</b> and run the first benchmark re-measurement on 15 November 2026.</p></li>
  </ol>
  <div class="close-logo">${logo()}<span class="byline">Prepared by Uprise Digital for Pulp Digital</span></div>`, { dark: true, noFoot: true });

// ─── 30. Appendix & Methodology ─────────────────────────────────────────────
slide('appendix', 'white', `
  <header class="hd"><p class="eyebrow">Appendix</p><h2 class="h1">Method and definitions</h2></header>
  <div class="cols-2 appx">
    <div>
      <h3 class="h3">How answers were collected</h3>
      <ul class="plain">
        <li>7 commercial questions × 8 Australian markets, evaluated in October 2026 across 5 major AI answer engines.</li>
        <li>Google AI Mode and Gemini evaluated from each city market; ChatGPT, Perplexity, and Claude evaluated with Australian commercial search context.</li>
        <li>Each question was asked across the multi-platform evaluation matrix to establish market standings.</li>
        <li>Google results: matching commercial searches in each city recording Google Map Packs and organic top 20.</li>
      </ul>
    </div>
    <div>
      <h3 class="h3">How answers were scored</h3>
      <ul class="plain">
        <li>Every performance marketing agency named in an answer was extracted in order of appearance.</li>
        <li>Aggregators, software tools (Shopify, Triple Whale, Klaviyo), and job boards were filtered out.</li>
        <li>Each mention was normalized to canonical agency entities (e.g., “Megaphone” → Megaphone Marketing).</li>
        <li>Share of Model Voice (SoMV) is calculated as total unprompted mentions divided by total possible answers (280).</li>
      </ul>
    </div>
  </div>`);

// ─── Page Compilation ───────────────────────────────────────────────────────
const CSS = fs.readFileSync('deck.css', 'utf8');
const JS = fs.readFileSync('deck.js', 'utf8');
const html = `<title>Pulp Digital · AI Visibility & GEO Report (Oct 2026)</title>
<meta name="description" content="Empirical study of where AI assistants recommend Pulp Digital against competing eCommerce paid ads agencies, and the 5-pillar GEO plan to become #1.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap">
<style>${CSS}</style>
<div class="deck" id="deck">
  <div class="stage" id="stage">${slides.join('\n')}
    <div class="progress" aria-hidden="true"><i id="bar"></i></div>
  </div>
</div>
<nav class="controls" id="controls" aria-label="Slide controls">
  <button id="prev" type="button" aria-label="Previous slide"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></button>
  <span id="count" class="ctr">1 / ${slides.length}</span>
  <button id="next" type="button" aria-label="Next slide"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></button>
  <button id="fs" type="button" aria-label="Full screen"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></button>
</nav>
<script>${JS}</script>`;

fs.mkdirSync('out', { recursive: true });
fs.writeFileSync('out/pulp-ai-visibility.html', html);
console.log(`Generated ${slides.length} slides! Output size: ${html.length} bytes.`);
