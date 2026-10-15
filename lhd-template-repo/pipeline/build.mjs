// Builds the LHD AI visibility deck (single HTML file) from the collected data.
import fs from 'fs';

const M = JSON.parse(fs.readFileSync('metrics.json'));
const H = JSON.parse(fs.readFileSync('hist.json'));
const MAP = JSON.parse(fs.readFileSync('map.json'));
const LOGO_SRC = fs.readFileSync('logo.svg', 'utf8')
  .replace(/<\?xml[^>]*>\s*/, '')
  .replace(/fill="black"/g, 'fill="currentColor"')
  .replace('<svg ', '<svg class="logo" aria-label="LHD Lawyers" role="img" ');
let logoN = 0;
const logo = () => { logoN++; return LOGO_SRC.replace(/mask0/g, `lhdmask${logoN}`); };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pct = (n, d) => Math.round((n / d) * 100);
const LHD = 'LHD Lawyers';
const SHORT = { 'Beilby Poulden Costello (BPC)': 'BPC Lawyers', 'Henry Carus + Associates': 'Henry Carus + Assoc.', 'Tasmanian Compensation Lawyers': 'Tasmanian Comp. Lawyers' };
const short = n => SHORT[n] || n;
const CITY = { sydney: 'Sydney', melbourne: 'Melbourne', brisbane: 'Brisbane', perth: 'Perth', adelaide: 'Adelaide', canberra: 'Canberra', newcastle: 'Newcastle', hobart: 'Hobart' };
const ORDER = ['sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'canberra', 'newcastle', 'hobart'];
const PLAT = [['chatgpt', 'ChatGPT'], ['aimode', 'Google AI Mode'], ['gemini', 'Gemini'], ['perplexity', 'Perplexity'], ['claude', 'Claude']];
const PRAC = [['general', 'Personal injury'], ['workers', "Workers' comp"], ['motor', 'Car accidents'], ['nwnf', 'No win no fee'], ['medneg', 'Medical negligence'], ['tpd', 'TPD & super'], ['publiab', 'Public liability']];

// ─── Derived figures ────────────────────────────────────────────────────────
const nat = M.national;
const cityStats = Object.fromEntries(ORDER.map(c => {
  const m = M.cities[c];
  const leader = m.top.find(x => x.name !== LHD);
  return [c, { ...m, rate: pct(m.lhdMentions, m.answers), leader, leaderRate: pct(leader.n, m.answers) }];
}));
// Google footprint: of the 7 searches from the city, how many show LHD in the map pack or top 10
const footprint = Object.fromEntries(ORDER.map(c => [c, M.cities[c].serp.filter(s => s.lhdLocal || (s.lhdOrganic && s.lhdOrganic <= 10)).length]));
const mapPack = Object.fromEntries(ORDER.map(c => [c, M.cities[c].serp.filter(s => s.lhdLocal).length]));

// National trend (Google AI answers, LLM Mentions database)
const MONTHS = [];
for (let y = 2025, m = 8; !(y === 2026 && m === 10); m === 12 ? (y++, m = 1) : m++) MONTHS.push([y, m]);
const series = d => MONTHS.map(([y, m]) => H[d].hist.find(i => i.year === y && i.month === m)?.metrics?.mentions ?? 0);
const TRACKED = Object.keys(H).filter(d => Array.isArray(H[d].hist) && d !== 'atb.com.au');
const shareSeries = MONTHS.map((_, i) => {
  const tot = TRACKED.reduce((s, d) => s + series(d)[i], 0);
  return +(series('lhd.com.au')[i] / tot * 100).toFixed(1);
});
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monLabel = ([y, m]) => `${MON[m - 1]} ${String(y).slice(2)}`;

// AI search demand, DataForSEO AI keyword data (Australia), "personal injury lawyer"
const AIDEMAND = { labels: ['Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26'], values: [350, 337, 409, 389, 350, 292, 285, 308, 285, 352, 414, 647] };

console.log('share series', shareSeries.join(' '));
console.log('footprint', footprint, 'mapPack', mapPack);

// ─── Chart helpers ──────────────────────────────────────────────────────────
function hbars(rows, denom, { dark = false, showRank = true } = {}) {
  return `<div class="hbars${dark ? ' on-dark' : ''}${showRank ? '' : ' no-rank'}">${rows.map((r, i) => `
    <div class="hb-row${r.name === LHD ? ' is-lhd' : ''}${r.gapBefore ? ' gap-before' : ''}" style="--i:${i}">
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
  // end-label de-collision
  const ends = series.filter(s => s.label !== false).map(s => ({ s, y: y(s.values[s.values.length - 1]) })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < ends.length; k++) if (ends[k].y - ends[k - 1].y < 36) ends[k].y = ends[k - 1].y + 36;
  const paths = series.map((s, si) => {
    const d = s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
    const ar = (area && s.area) ? `<path d="${d}L${x(s.values.length - 1)},${y(0)}L${x(0)},${y(0)}Z" fill="url(#${s.area})" class="fadein"/>` : '';
    const last = s.values.length - 1;
    return `${ar}<path d="${d}" pathLength="1" class="draw ${s.cls || ''}" style="--d:${si * 120}ms" fill="none" stroke="${s.color}" stroke-width="${s.width || 4}" stroke-linejoin="round" stroke-linecap="round" ${s.dash ? `stroke-dasharray="${s.dash}"` : ''}/>
      ${s.cls === 'lhd' || s.area ? `<circle cx="${x(last)}" cy="${y(s.values[last])}" r="${s.r || 8}" class="pulse" style="--d:1900ms"/>` : ''}<circle cx="${x(last)}" cy="${y(s.values[last])}" r="${s.r || 8}" fill="${s.color}" class="pop" style="--d:${1300 + si * 120}ms" stroke="${dark ? '#121A2D' : '#FFFFFF'}" stroke-width="4"/>`;
  }).join('');
  const el = endLabels ? ends.map(({ s, y: yy }) => `<text x="${w - pr + 22}" y="${yy + 9}" class="el ${s.cls || ''}" fill="${s.textColor || (dark ? '#E9EDF6' : '#111A2E')}">${esc(s.name)} <tspan class="elv">${s.valueLabel ?? s.values[s.values.length - 1]}</tspan></text>`).join('') : '';
  const annotations = ann.map(a => a(x, y)).join('');
  return `<svg class="chart ${dark ? 'dark' : ''}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(series.map(s => s.name).join(', '))} line chart">
    <defs><linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2251FF" stop-opacity=".28"/><stop offset="1" stop-color="#2251FF" stop-opacity="0"/></linearGradient></defs>
    ${grid}${xl}${paths}${el}${annotations}</svg>`;
}

// ─── Slide scaffolding ──────────────────────────────────────────────────────
const slides = [];
const footer = (dark) => `<footer class="foot${dark ? ' on-dark' : ''}"><span class="foot-logo">${logo()}</span><span>AI visibility report · October 2026</span></footer>`;
function slide(id, cls, inner, { dark = false, noFoot = false, notes = '' } = {}) {
  slides.push(`<section class="slide ${cls}" id="${id}" data-title="${esc(id)}"${notes ? ` data-notes="${esc(notes)}"` : ''}>${inner}${noFoot ? '' : footer(dark)}</section>`);
}
const src = (t, dark) => `<p class="src${dark ? ' on-dark' : ''}">${t}</p>`;
const SRC_ANS = 'Source: 280 AI answers collected 6 Oct 2026 from ChatGPT, Google AI Mode, Gemini, Perplexity and Claude. A firm counts once per answer.';

// ─── 1. Cover ───────────────────────────────────────────────────────────────
{
  const rows = ORDER.map(c => {
    const all = JSON.parse(fs.readFileSync('ans_full.json')).filter(a => a.city === c);
    const ordered = PRAC.flatMap(([p]) => PLAT.map(([pl]) => all.find(a => a.prompt === p && a.platform === pl)));
    return { c, cells: ordered.map(a => a && a.firms.some(f => f.name === LHD)) };
  });
  const grid = rows.map((r, ri) => `<div class="cv-row"><span class="cv-city">${CITY[r.c]}</span><span class="cv-cells">${r.cells.map((on, ci) => `<i class="${on ? 'on' : ''}" style="--d:${(ri * 35 + ci) * 6}ms"></i>`).join('')}</span><span class="cv-n">${r.cells.filter(Boolean).length}</span></div>`).join('');
  slide('cover', 'dark cover', `
    <div class="cover-bg" aria-hidden="true"></div>
    <div class="cover-logo rise" style="--d:0ms">${logo()}</div>
    <div class="cover-main">
      <p class="eyebrow on-dark rise" style="--d:100ms">AI visibility report · October 2026</p>
      <h1 class="display rise" style="--d:180ms">When Australians ask AI for a compensation lawyer, who gets named?</h1>
      <p class="lede on-dark rise" style="--d:300ms">LHD Lawyers against the competition in 8 cities, across 5 AI assistants and 280 real answers. We start with Sydney.</p>
      <p class="byline rise" style="--d:420ms">Prepared by Uprise Digital</p>
    </div>
    <figure class="cover-grid rise" style="--d:350ms" aria-label="Grid of 280 AI answers by city; highlighted squares name LHD">
      <figcaption><span class="key on"></span>Answer names LHD <span class="key"></span>Answer leaves LHD out</figcaption>
      ${grid}
      <p class="cv-total"><b class="count" data-to="${nat.lhdMentions}">${nat.lhdMentions}</b> of 280 answers name LHD</p>
    </figure>`, { dark: true, noFoot: true });
}

// ─── 2. Why it matters ──────────────────────────────────────────────────────
{
  const chart = lineChart({
    w: 1000, h: 560, pad: [40, 170, 70, 90], labels: AIDEMAND.labels, yMax: 700, yTicks: [0, 200, 400, 600],
    series: [{ name: 'Sep 26', values: AIDEMAND.values, color: '#2251FF', width: 6, area: 'gBlue', valueLabel: '' , label: false}],
    area: true, endLabels: false,
    ann: [
      (x, y) => `<g class="pop" style="--d:1500ms"><text x="${x(11) + 24}" y="${y(647) + 10}" class="callnum">647</text></g>`,
      (x, y) => `<text x="${x(0)}" y="${y(350) - 26}" class="callsmall" text-anchor="start">350</text>`,
    ],
  });
  slide('why', 'light', `
    <header class="hd"><p class="eyebrow">Why this matters now</p><h2 class="h1">More Australians are asking AI which lawyer to call</h2></header>
    <div class="cols-2 why">
      <div class="panel">
        <div class="kpi-inline"><span class="big blue">+85%</span><span class="kpi-cap">estimated monthly AI-assistant searches for <b>“personal injury lawyer”</b> in Australia, Oct 2025 to Sep 2026</span></div>
        ${chart}
      </div>
      <ol class="points">
        <li class="rise" style="--d:300ms"><b>AI gives a shortlist, not ten blue links.</b> The answers we collected named a median of 6 firms. A firm that isn't on the list doesn't get the call.</li>
        <li class="rise" style="--d:450ms"><b>Each assistant builds its list from sources it trusts:</b> rankings guides, legal directories, Google Maps and firm websites.</li>
        <li class="rise" style="--d:600ms"><b>The shortlist changes by city.</b> LHD is the first name in Hobart and barely appears in Brisbane, so each market needs its own plan.</li>
      </ol>
    </div>
    ${src('Source: DataForSEO AI keyword data (estimated AI search volume, Australia), October 2026; answer counts from this study.')}`);
}

// ─── 3. Method ──────────────────────────────────────────────────────────────
slide('method', 'white', `
  <header class="hd"><p class="eyebrow">How we measured it</p><h2 class="h1">280 real AI answers, collected on 6 October 2026</h2></header>
  <div class="formula">
    <div class="f-item rise" style="--d:100ms"><span class="f-num">8</span><span class="f-lab">cities where LHD has an office</span></div>
    <span class="f-op">×</span>
    <div class="f-item rise" style="--d:220ms"><span class="f-num">7</span><span class="f-lab">questions a real client would ask</span></div>
    <span class="f-op">×</span>
    <div class="f-item rise" style="--d:340ms"><span class="f-num">5</span><span class="f-lab">AI assistants</span></div>
    <span class="f-op">=</span>
    <div class="f-item total rise" style="--d:460ms"><span class="f-num">280</span><span class="f-lab">answers read and scored</span></div>
  </div>
  <div class="cols-2 method-cols">
    <div>
      <h3 class="h3">The 7 questions (Sydney wording)</h3>
      <ol class="qlist">
        <li>Who are the best personal injury lawyers in Sydney?</li>
        <li>Who are the best workers compensation lawyers in Sydney?</li>
        <li>I was hurt in a car accident in Sydney. Which compensation lawyers should I contact?</li>
        <li>Which no win no fee compensation lawyers in Sydney would you recommend?</li>
        <li>Who are the top medical negligence lawyers in Sydney?</li>
        <li>Which lawyers in Sydney are best for TPD and superannuation insurance claims?</li>
        <li>I slipped and fell in a shopping centre in Sydney. Which public liability lawyers are best?</li>
      </ol>
    </div>
    <div>
      <h3 class="h3">The 5 assistants</h3>
      <ul class="plist">
        <li><b>ChatGPT</b><span>with web search, from Australia</span></li>
        <li><b>Google AI Mode</b><span>searched from each city</span></li>
        <li><b>Gemini</b><span>located in each city</span></li>
        <li><b>Perplexity</b><span>Sonar, web search on</span></li>
        <li><b>Claude</b><span>Sonnet 4.6, web search on</span></li>
      </ul>
      <p class="note">We also ran the same 7 searches on Google from each city (56 searches) to record the map pack and top 20 results.</p>
    </div>
  </div>`);

// ─── 4. National standings ──────────────────────────────────────────────────
{
  const rows = nat.top.slice(0, 10).map((x, i) => ({ ...x, leader: i === 0 }));
  slide('national', 'light', `
    <header class="hd"><p class="eyebrow">National standings</p><h2 class="h1">Across all 8 cities, LHD is the 4th most-named firm</h2></header>
    <div class="cols-60">
      <div class="panel">
        <p class="chart-title">Answers naming each firm, out of 280 <span class="muted">· 261 firms named in total</span></p>
        ${hbars(rows, 280)}
      </div>
      <div class="side-stats">
        <div class="stat rise" style="--d:500ms"><span class="big blue"><b class="count" data-to="${pct(nat.lhdMentions, 280)}">${pct(nat.lhdMentions, 280)}</b>%</span><span class="stat-cap">of answers name LHD (${nat.lhdMentions} of 280). Slater and Gordon leads with 118.</span></div>
        <div class="stat rise" style="--d:650ms"><span class="big">27%</span><span class="stat-cap">without Hobart. 33 of LHD's 99 mentions come from Hobart alone, so the national figure flatters the other cities.</span></div>
        <div class="stat rise" style="--d:800ms"><span class="big">${nat.cited}</span><span class="stat-cap">answers cite lhd.com.au as a source, more than any other firm's website. AI reads LHD's site; it doesn't always recommend LHD.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 5. Map ─────────────────────────────────────────────────────────────────
{
  const R = r => 8 + Math.sqrt(r / 100) * 50;
  const COL = 960;
  const lab = {
    brisbane: [COL, 300, 'start'], newcastle: [COL, 405, 'start'], sydney: [COL, 510, 'start'], canberra: [COL, 615, 'start'],
    melbourne: [COL, 720, 'start'], hobart: [COL, 825, 'start'], perth: [-235, 440, 'start'], adelaide: [470, 690, 'end'],
  };
  const circles = ORDER.map((c, i) => {
    const s = cityStats[c]; const [px, py] = MAP.pts[c];
    const [lx, ly, anchor] = lab[c];
    const ex = anchor === 'start' ? lx - 14 : lx + 14;
    return `<g class="mp" style="--d:${300 + i * 130}ms">
      <circle cx="${px}" cy="${py}" r="${R(s.leaderRate)}" class="ring pop" style="--d:${300 + i * 130}ms"/>
      <circle cx="${px}" cy="${py}" r="${R(s.rate)}" class="pulse" style="--d:${1600 + i * 180}ms"/>
      <circle cx="${px}" cy="${py}" r="${R(s.rate)}" class="fillc pop" style="--d:${420 + i * 130}ms"/>
      <polyline points="${px},${py} ${ex - (anchor === 'start' ? 40 : -40)},${ly - 12} ${ex},${ly - 12}" fill="none" class="leader-line fadein" style="--d:${600 + i * 130}ms"/>
      <g class="fadein" style="--d:${650 + i * 130}ms">
        <text x="${lx}" y="${ly - 2}" text-anchor="${anchor}" class="m-city">${CITY[c]}</text>
        <text x="${lx}" y="${ly + 34}" text-anchor="${anchor}" class="m-stat"><tspan class="m-blue">${s.rate}%</tspan>  ·  #${s.lhdRank}</text>
      </g></g>`;
  }).join('');
  slide('map', 'dark', `
    <header class="hd"><p class="eyebrow on-dark">City by city</p><h2 class="h1">LHD's standing changes sharply from city to city</h2></header>
    <div class="map-wrap">
      <svg class="ausmap" viewBox="-250 -20 1460 880" width="1100" height="663" role="img" aria-label="Map of Australia showing LHD share of AI answers per city">
        <path d="${MAP.d}" class="land"/>
        ${circles}
      </svg>
      <div class="map-side">
        <div class="legend-map">
          <p><svg width="44" height="44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="#2251FF"/></svg><span>Share of the city's 35 answers that name LHD</span></p>
          <p><svg width="44" height="44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="none" stroke="#AEB8CD" stroke-width="2.5" stroke-dasharray="5 5"/></svg><span>Share for the city's most-named competitor</span></p>
        </div>
        <table class="rank-table">
          <thead><tr><th>City</th><th>LHD</th><th>Rank</th><th>Most-named competitor</th></tr></thead>
          <tbody>${ORDER.map(c => { const s = cityStats[c]; return `<tr><td>${CITY[c]}</td><td class="num blue-t">${s.rate}%</td><td class="num">#${s.lhdRank}</td><td>${esc(short(s.leader.name))} <span class="muted-d">${s.leaderRate}%</span></td></tr>`; }).join('')}</tbody>
        </table>
        <p class="note on-dark">Rank is among all firms named in that city. Perth: LHD and Maurice Blackburn are tied on 19 answers.</p>
      </div>
    </div>`, { dark: true });
}

// ─── City deep dives ────────────────────────────────────────────────────────
const NOTES = {
  sydney: null,
  melbourne: {
    title: 'In Melbourne, LHD owns TPD answers but misses TAC and medical negligence',
    finds: [
      ['TPD & super is a win.', 'LHD is named in 5 of 5 Melbourne TPD answers, more than any other firm.'],
      ['Two practice areas are blank.', 'LHD is in 0 of 5 car accident (TAC) answers and 0 of 5 medical negligence answers, although LHD has a Melbourne page for each.'],
      ['Google Maps:', 'LHD appears in 2 of 7 Melbourne map packs, rated 4.9 from 170 reviews.'],
    ],
  },
  brisbane: {
    title: 'In Brisbane, AI almost never names LHD',
    finds: [
      ['One mention in 35 answers.', 'Gemini named LHD once, for workers’ compensation. Maurice Blackburn, Shine Lawyers and Splatt Lawyers fill the lists instead.'],
      ['No Google presence from Brisbane.', 'LHD was not in any of 7 Brisbane map packs and ranked in the top 10 for none of the 7 searches.'],
      ['A thin Brisbane page.', 'About 450 words, no practice pages, last updated July 2025, and no mention of WorkCover Queensland by name.'],
    ],
  },
  perth: {
    title: 'In Perth, LHD is level with Maurice Blackburn for first place',
    finds: [
      ['ChatGPT and Gemini favour LHD.', 'LHD is the most-named firm on both (5 of 7 and 4 of 7).'],
      ['Strong where it matters.', 'TPD & super 5 of 5 and no win no fee 4 of 5. Workers’ comp is the gap: 1 of 5, against Stephen Browne Lawyers on 4.'],
      ['Google Maps works here:', 'LHD shows in 5 of 7 Perth map packs, rated 4.9 from 372 reviews.'],
    ],
  },
  adelaide: {
    title: 'In Adelaide, local firms own the AI answers',
    finds: [
      ['Two mentions in 35 answers.', 'Tindall Gask Bentley is named in 29, Duncan Basheer Hannon in 22 and Johnston Withers in 19.'],
      ['Google rank does not carry over.', 'LHD ranks #1 on Google for “car accident lawyers adelaide”, yet AI named LHD in only 2 of 5 car accident answers.'],
      ['No map pack, no practice pages.', 'LHD was in none of the 7 Adelaide map packs (DBH Lawyers was in 6), and the Adelaide page has no practice sub-pages.'],
    ],
  },
  canberra: {
    title: 'In Canberra, Perplexity backs LHD but Gemini ignores it',
    finds: [
      ['Perplexity names LHD most often:', '6 of 7 answers, ahead of every other firm. It cites LHD’s Canberra office page.'],
      ['Gemini named LHD in 0 of 7.', 'Gemini leans on Google Maps, where the Canberra profile has a 4.0 rating from just 4 reviews.'],
      ['Google search is solid:', 'top 10 for 3 of 7 Canberra searches (TPD #3, public liability #4, medical negligence #8).'],
    ],
  },
  newcastle: {
    title: 'In Newcastle, Turner Freeman leads and LHD sits 8th',
    finds: [
      ['Uneven across assistants.', 'Gemini and Claude name LHD in 4 of 7 answers each. ChatGPT named it once and Perplexity never.'],
      ['TPD is a gap here:', '0 of 5, while Turner Freeman is named in all 5.'],
      ['Thin Google profile.', '5.0 rating from only 3 reviews. Taylor & Scott, now part of LHD, is still named as a separate firm.'],
    ],
  },
  hobart: {
    title: 'In Hobart, LHD is the first name AI gives. This is the blueprint.',
    finds: [
      ['Named in 33 of 35 answers,', 'usually first or second. All 5 assistants name LHD in at least 6 of their 7 answers.'],
      ['Google backs it up.', 'LHD is in all 7 Hobart map packs (4.8 from 127 reviews) and ranks #1 for “personal injury lawyers hobart”.'],
      ['The lesson:', 'when Google Maps, Google search and the office page all point to LHD, every assistant follows.'],
    ],
  },
};

function cityBars(c, n = 7) {
  const m = cityStats[c];
  const rows = m.top.slice(0, n).map((x, i) => ({ ...x, rank: i + 1, leader: i === 0 && x.name !== LHD }));
  if (!rows.find(r => r.name === LHD)) rows.push({ ...(m.lhd || { name: LHD, n: m.lhdMentions }), rank: m.lhdRank, gapBefore: true });
  return hbars(rows, m.answers);
}
function platStrip(c) {
  const m = cityStats[c];
  return `<div class="strip">${PLAT.map(([p, label], i) => { const v = m.byPlat[p]; return `<div class="strip-row" style="--i:${i}"><span class="strip-lab">${label}</span>${dots(v.lhd, 7)}<span class="strip-val">${v.lhd}/7</span></div>`; }).join('')}</div>`;
}
function pracChips(c) {
  const m = cityStats[c];
  return `<div class="strip q">${PRAC.map(([p, label], i) => { const v = m.byPrompt[p]; return `<div class="strip-row${v.lhd === 0 ? ' zero' : ''}" style="--i:${i + 5}"><span class="strip-lab">${label}</span>${dots(v.lhd, 5)}<span class="strip-val">${v.lhd}/5</span></div>`; }).join('')}</div>`;
}

function citySlide(c, idx) {
  const m = cityStats[c]; const N = NOTES[c];
  slide(`city-${c}`, idx % 2 ? 'white' : 'light', `
    <header class="hd"><p class="eyebrow">${String(idx).padStart(2, '0')} · ${CITY[c]}</p><h2 class="h1">${esc(N.title)}</h2></header>
    <div class="city3">
      <div class="panel">
        <p class="chart-title">Answers naming each firm in ${CITY[c]}, out of 35</p>
        ${cityBars(c)}
      </div>
      <div class="city-side">
        <div class="kpis">
          <div class="kpi"><span class="big blue"><b class="count" data-to="${m.rate}">${m.rate}</b>%</span><span class="kpi-cap">answers naming LHD</span></div>
          <div class="kpi"><span class="big">#${m.lhdRank}</span><span class="kpi-cap">of ${m.firmsNamed} firms named</span></div>
        </div>
        <p class="mini-title">By assistant · of 7 questions</p>${platStrip(c)}
        <p class="mini-title">By question · of 5 assistants</p>${pracChips(c)}
      </div>
      <div class="finds-col">${N.finds.map(([b, t], i) => `<p class="rise" style="--d:${700 + i * 140}ms"><b>${esc(b)}</b> ${esc(t)}</p>`).join('')}</div>
    </div>
    ${src(SRC_ANS + ' Google data: 7 searches from the city on the same day.')}`);
}

// ─── Sydney section ─────────────────────────────────────────────────────────
{
  const s = cityStats.sydney;
  slide('sydney-intro', 'accent', `
    <p class="eyebrow on-accent rise" style="--d:0ms">01 · Sydney, LHD's home market</p>
    <h2 class="display on-accent rise" style="--d:120ms">Sydney is where the gap is widest, and where closing it is worth the most.</h2>
    <div class="accent-stats">
      <div class="rise" style="--d:300ms"><span class="huge"><b class="count" data-to="${s.rate}">${s.rate}</b>%</span><span class="acap">of Sydney answers name LHD (${s.lhdMentions} of 35)</span></div>
      <div class="rise" style="--d:450ms"><span class="huge">#${s.lhdRank}</span><span class="acap">LHD's rank among ${s.firmsNamed} firms named</span></div>
      <div class="rise" style="--d:600ms"><span class="huge"><b class="count" data-to="${s.leaderRate}">${s.leaderRate}</b>%</span><span class="acap">for Law Partners, the most-named firm (${s.leader.n} of 35)</span></div>
    </div>`, { dark: true });

  slide('sydney-board', 'light', `
    <header class="hd"><p class="eyebrow">01 · Sydney</p><h2 class="h1">AI names LHD in 9 of 35 Sydney answers. Law Partners gets 27.</h2></header>
    <div class="city-grid">
      <div class="panel"><p class="chart-title">Answers naming each firm in Sydney, out of 35</p>${hbars(s.top.slice(0, 9).map((x, i) => ({ ...x, rank: i + 1, leader: i === 0 })), 35)}</div>
      <div class="city-side">
        <div class="kpis">
          <div class="kpi"><span class="big blue">${s.rate}%</span><span class="kpi-cap">answers naming LHD</span></div>
          <div class="kpi"><span class="big">−${s.leader.n - s.lhdMentions}</span><span class="kpi-cap">answers behind the leader</span></div>
        </div>
        <p class="mini-title">LHD by assistant</p>${platStrip('sydney')}
        <p class="note">Only ChatGPT puts LHD in a majority of its Sydney answers (4 of 7). Google AI Mode, Perplexity and Claude each named LHD once.</p>
      </div>
    </div>
    ${src(SRC_ANS)}`);

  // Heatmap
  const rowsH = ['Law Partners', 'Garling & Co', 'Turner Freeman', 'Beilby Poulden Costello (BPC)', 'Maurice Blackburn', 'Slater and Gordon', LHD];
  const shade = v => ['#EEF1F7', '#DCE4FF', '#C2D0FF', '#9DB2FF', '#7290FF', '#4A6EFF', '#2E5BFF', '#2251FF'][v];
  const heat = `<div class="heat" role="table" aria-label="Sydney answers naming each firm by assistant">
    <div class="heat-row head" role="row"><span role="columnheader"></span>${PLAT.map(([, l]) => `<span role="columnheader">${l}</span>`).join('')}<span role="columnheader">Total</span></div>
    ${rowsH.map((f, ri) => { const r = s.matrix[f]; const tot = Object.values(r).reduce((a, b) => a + b, 0); return `<div class="heat-row${f === LHD ? ' is-lhd' : ''}" role="row"><span class="heat-name" role="rowheader">${esc(short(f))}</span>${PLAT.map(([p], ci) => `<span role="cell" class="cell pop" style="--d:${200 + (ri * 5 + ci) * 35}ms;background:${shade(r[p])};color:${r[p] >= 4 ? '#FFFFFF' : '#111A2E'}">${r[p]}</span>`).join('')}<span class="heat-tot" role="cell">${tot}<small>/35</small></span></div>`; }).join('')}
  </div>`;
  slide('sydney-heat', 'white', `
    <header class="hd"><p class="eyebrow">01 · Sydney</p><h2 class="h1">Each assistant has its own Sydney favourites, and LHD isn't one of them</h2></header>
    <div class="cols-heat">
      <div class="panel"><p class="chart-title">Sydney answers naming each firm, by assistant (out of 7 per assistant)</p>${heat}
        <div class="heat-scale" aria-hidden="true"><span>0</span>${[0, 1, 2, 3, 4, 5, 6, 7].map(v => `<i style="background:${shade(v)}"></i>`).join('')}<span>7 of 7</span></div></div>
      <div class="side-stats">
        <div class="stat"><span class="big">6/7</span><span class="stat-cap"><b>Garling & Co</b> on Google AI Mode and Claude. It shows in 5 of 7 Sydney map packs.</span></div>
        <div class="stat"><span class="big">6/7</span><span class="stat-cap"><b>Law Partners</b> on ChatGPT and Perplexity. It has 1,600 Google reviews and Doyle's Guide First Tier ranking.</span></div>
        <div class="stat"><span class="big blue">1/7</span><span class="stat-cap"><b>LHD</b> on Google AI Mode, Perplexity and Claude.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);

  // Practice areas
  const pr = PRAC.map(([p, label]) => ({ label, ...s.byPrompt[p] }));
  slide('sydney-practice', 'light', `
    <header class="hd"><p class="eyebrow">01 · Sydney</p><h2 class="h1">LHD is missing from every Sydney medical negligence answer</h2></header>
    <div class="cols-60">
      <div class="panel">
        <div class="prac-head"><span>Question</span><span>LHD (of 5 assistants)</span><span>Most-named firm</span></div>
        ${pr.map((r, i) => `<div class="prac-row${r.lhd === 0 ? ' zero' : ''}" style="--i:${i}"><span class="prac-lab">${r.label}</span><span class="prac-dots">${dots(r.lhd, 5, 'big')}<b>${r.lhd}/5</b></span><span class="prac-lead">${esc(short(r.leader))} <b>${r.leaderN}/5</b></span></div>`).join('')}
      </div>
      <div class="side-stats">
        <div class="stat"><span class="big">#5</span><span class="stat-cap">LHD's Google rank for “medical negligence lawyers sydney”, and LHD has a Sydney medical negligence page. AI still left LHD out of all 5 answers.</span></div>
        <div class="stat"><span class="big">#6</span><span class="stat-cap">for “personal injury lawyers sydney”. Ranking on Google alone doesn't get a firm named.</span></div>
        <div class="stat"><span class="big blue">3/5</span><span class="stat-cap">No win no fee is LHD's best Sydney question. That is the message on LHD's homepage.</span></div>
      </div>
    </div>
    ${src(SRC_ANS + ' Google ranks: live results from Sydney, 6 Oct 2026.')}`);

  // Why leaders win
  const T = [
    ['Law Partners', 27, 'First Tier', '4.9 (1,600)', 3],
    ['Garling & Co', 21, 'Recommended', '4.9 (173)', 5],
    ['Turner Freeman', 19, 'First Tier', '4.7 (120)', 2],
    ['BPC Lawyers', 16, 'First Tier', '4.8 (99)', 2],
    ["Carroll & O'Dea", 11, 'First Tier', '4.4 (137)', 0],
    ['Taylor & Scott', 6, 'Not ranked', '4.9 (361)', 3],
    ['LHD Lawyers', 9, 'Third Tier', '4.8 (421)', 1],
  ];
  slide('sydney-why', 'white', `
    <header class="hd"><p class="eyebrow">01 · Sydney</p><h2 class="h1">Sydney's AI favourites lead on rankings guides and Google Maps</h2></header>
    <table class="why-table">
      <thead><tr><th style="width:24%">Firm</th><th style="width:18%">Sydney AI answers</th><th style="width:22%">Doyle's Guide 2026, NSW work injury</th><th style="width:18%">Google rating (reviews)</th><th style="width:18%">Sydney map packs</th></tr></thead>
      <tbody>${T.map(([f, n, tier, rating, mp], i) => `<tr class="${f === 'LHD Lawyers' ? 'is-lhd' : ''}${f === 'Taylor & Scott' ? ' is-ts' : ''} rise" style="--d:${150 + i * 90}ms">
        <td><b>${esc(f)}</b>${f === 'Taylor & Scott' ? '<span class="tag">acquired by LHD</span>' : ''}</td>
        <td><span class="cellbar"><i style="width:${n / 35 * 100}%"></i></span><b class="num">${n}</b><span class="muted">/35</span></td>
        <td><span class="tier tier-${tier.split(' ')[0].toLowerCase()}">${tier}</span></td>
        <td class="num">${rating}</td>
        <td>${dots(mp, 7)} <b class="num">${mp}/7</b></td></tr>`).join('')}</tbody>
    </table>
    <div class="finds two">
      <p><b>Doyle's Guide is cited in 9 of 35 Sydney answers.</b> All four First Tier firms are in Sydney's AI top 7. LHD is Third Tier.</p>
      <p><b>Taylor & Scott is an asset AI doesn't connect to LHD.</b> It appears in 3 of 7 Sydney map packs and 6 AI answers as a separate firm.</p>
    </div>
    ${src("Sources: this study; Doyle's Guide 2026, NSW work injury compensation (plaintiff); Google map packs and ratings from 7 Sydney searches, 6 Oct 2026.")}`);
}

// ─── Other cities ───────────────────────────────────────────────────────────
['melbourne', 'brisbane', 'perth', 'adelaide', 'canberra', 'newcastle', 'hobart'].forEach((c, i) => citySlide(c, i + 2));

// ─── Pattern scatter ────────────────────────────────────────────────────────
{
  const w = 1000, h = 640, pl = 110, pr = 60, pt = 40, pb = 100;
  const x = v => pl + v / 7 * (w - pl - pr), y = v => pt + (h - pt - pb) * (1 - v / 100);
  // label slots in data units [x, y%, anchor]; the three cities at x=3 get a stacked column with leader lines
  const slot = { canberra: [3.55, 46, 'start'], newcastle: [3.55, 33, 'start'], sydney: [3.55, 20, 'start'], melbourne: [1.75, 45, 'end'], brisbane: [0.15, 25, 'start'], adelaide: [1.3, 12, 'start'], perth: [5.25, 54, 'start'], hobart: [6.75, 94, 'end'] };
  const pts = ORDER.map((c, i) => { const [sx, sy, a] = slot[c]; const px = x(footprint[c]), py = y(cityStats[c].rate), lx = x(sx), ly = y(sy);
    const needLine = Math.hypot(lx - px, ly - py) > 60;
    return `<g class="pop" style="--d:${300 + i * 110}ms">${needLine ? `<polyline points="${px},${py} ${a === 'start' ? lx - 10 : lx + 10},${ly - 8}" fill="none" stroke="#9AA5BA" stroke-width="2"/>` : ''}<circle cx="${px}" cy="${py}" r="14" fill="#2251FF" stroke="#F3F5F9" stroke-width="4"/><text x="${lx}" y="${ly}" text-anchor="${a}" class="sc-lab">${CITY[c]} <tspan class="sc-v">${cityStats[c].rate}%</tspan></text></g>`; }).join('');
  const sc = `<svg class="chart" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Scatter of Google footprint against AI answer share by city">
    ${[0, 25, 50, 75, 100].map(t => `<line x1="${pl}" x2="${w - pr}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${pl - 16}" y="${y(t) + 8}" class="ax" text-anchor="end">${t}%</text>`).join('')}
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(t => `<text x="${x(t)}" y="${h - pb + 42}" class="ax" text-anchor="middle">${t}</text>`).join('')}
    <text x="${(pl + w - pr) / 2}" y="${h - 14}" class="ax-t" text-anchor="middle">Google searches (of 7) where LHD is in the map pack or top 10</text>
    <text transform="translate(26 ${(pt + h - pb) / 2}) rotate(-90)" class="ax-t" text-anchor="middle">AI answers naming LHD</text>
    ${pts}</svg>`;
  slide('pattern', 'light', `
    <header class="hd"><p class="eyebrow">The pattern</p><h2 class="h1">Where LHD shows up on Google, AI names LHD</h2></header>
    <div class="cols-60">
      <div class="panel">${sc}</div>
      <div class="side-stats">
        <div class="stat"><span class="big blue">7 of 7</span><span class="stat-cap"><b>Hobart:</b> LHD in every map pack, named in 94% of AI answers.</span></div>
        <div class="stat"><span class="big">0 of 7</span><span class="stat-cap"><b>Brisbane:</b> no map pack, no top-10 ranking, named in 3% of answers.</span></div>
        <div class="stat"><span class="big">3 of 7</span><span class="stat-cap"><b>Canberra:</b> named in 34%, above its Google footprint, because Perplexity quotes LHD's Canberra pages.</span></div>
        <p class="note">Eight cities show a pattern, not proof.</p>
      </div>
    </div>
    ${src(SRC_ANS + ' Google data: 56 searches from each city, 6 Oct 2026.')}`);
}

// ─── National trend ─────────────────────────────────────────────────────────
{
  const S = [
    ['Maurice Blackburn', 'mauriceblackburn.com.au', '#1F2A44', 4],
    ['Shine Lawyers', 'shine.com.au', '#7C879C', 3],
    ['Slater and Gordon', 'slatergordon.com.au', '#A3ACBD', 3],
    ['Law Partners', 'lawpartners.com.au', '#5A6680', 3],
    ['LHD Lawyers', 'lhd.com.au', '#2251FF', 7],
  ];
  const labels = MONTHS.map(monLabel);
  const chart = lineChart({
    w: 1140, h: 600, pad: [30, 300, 70, 90], labels, yMax: 1200, yTicks: [0, 300, 600, 900, 1200], yFmt: v => v.toLocaleString('en-AU'),
    series: S.map(([name, d, color, width]) => ({ name, values: series(d), color, width, cls: name === LHD ? 'lhd' : '', textColor: name === LHD ? '#2251FF' : '#111A2E' })),
  });
  const sh = lineChart({
    w: 520, h: 230, pad: [36, 40, 52, 70], labels: labels.map((l, i) => (i === 0 || i === labels.length - 1) ? l : ''), yMax: 10, yTicks: [0, 5, 10], yFmt: v => v + '%', endLabels: false,
    series: [{ name: 'LHD share', values: shareSeries, color: '#2251FF', width: 5, label: false }],
    ann: [(x, y) => `<text x="${x(labels.length - 1)}" y="${y(shareSeries[shareSeries.length - 1]) - 22}" text-anchor="end" class="callsmall blue">${shareSeries[shareSeries.length - 1]}%</text>`],
  });
  const lhdSep = series('lhd.com.au')[MONTHS.length - 1], mbSep = series('mauriceblackburn.com.au')[MONTHS.length - 1];
  slide('trend', 'white', `
    <header class="hd"><p class="eyebrow">14-month trend · Google AI answers</p><h2 class="h1">Google's AI references Maurice Blackburn five times as often as LHD</h2></header>
    <div class="cols-trend">
      <div class="panel"><p class="chart-title">Google AI answers in Australia that reference each firm's website, per month</p>${chart}</div>
      <div class="side-stats">
        <div class="stat"><span class="big">${(mbSep / lhdSep).toFixed(1)}×</span><span class="stat-cap">Maurice Blackburn's count against LHD's in September 2026 (${mbSep.toLocaleString('en-AU')} vs ${lhdSep}).</span></div>
        <div class="mini-chart"><p class="mini-title">LHD's share of references among 13 tracked firms</p>${sh}<p class="note">All lines move with how often Google shows AI answers. LHD's share has stayed between ${Math.min(...shareSeries)}% and ${Math.max(...shareSeries)}%.</p></div>
      </div>
    </div>
    ${src('Source: DataForSEO LLM Mentions database (Google AI Overviews and AI Mode, Australia), Aug 2025 to Sep 2026. Tracked set: 13 compensation firms.')}`);
}

// ─── Gap overview (dumbbell) ────────────────────────────────────────────────
{
  const w = 1200, rowH = 78, top = 70, left = 200, right = 140;
  const x = v => left + v / 100 * (w - left - right);
  const rows = ORDER.map((c, i) => {
    const s = cityStats[c]; const yy = top + i * rowH; const gap = s.rate - s.leaderRate;
    return `<g class="db" style="--d:${200 + i * 110}ms">
      <text x="0" y="${yy + 9}" class="db-city">${CITY[c]}</text>
      <line x1="${x(Math.min(s.rate, s.leaderRate))}" x2="${x(Math.max(s.rate, s.leaderRate))}" y1="${yy}" y2="${yy}" class="db-line grow-x" style="--d:${300 + i * 110}ms"/>
      <circle cx="${x(s.leaderRate)}" cy="${yy}" r="14" fill="#1F2A44" class="pop" style="--d:${250 + i * 110}ms"/>
      <circle cx="${x(s.rate)}" cy="${yy}" r="14" fill="#2251FF" stroke="#FFFFFF" stroke-width="4" class="pop" style="--d:${450 + i * 110}ms"/>
      <text x="${w - right + 30}" y="${yy + 9}" class="db-gap ${gap >= 0 ? 'pos' : ''}">${gap > 0 ? '+' : gap === 0 ? '±' : '−'}${Math.abs(gap)} pts</text>
      <text x="${x(s.leaderRate)}" y="${yy - 24}" text-anchor="middle" class="db-lead">${esc(short(s.leader.name))}</text>
    </g>`;
  }).join('');
  const svg = `<svg class="chart" viewBox="0 -10 ${w + 40} ${top + ORDER.length * rowH}" width="${w + 40}" height="${top + ORDER.length * rowH + 10}" role="img" aria-label="LHD share against the top competitor per city">
    ${[0, 25, 50, 75, 100].map(t => `<line x1="${x(t)}" x2="${x(t)}" y1="20" y2="${top + (ORDER.length - 1) * rowH + 30}" class="gl"/><text x="${x(t)}" y="10" class="ax" text-anchor="middle">${t}%</text>`).join('')}
    ${rows}</svg>`;
  slide('gap', 'light', `
    <header class="hd"><p class="eyebrow">The gap to close</p><h2 class="h1">LHD trails the most-named firm in 6 of 8 cities</h2></header>
    <div class="legend-row"><span><i class="lg-dot blue"></i>LHD</span><span><i class="lg-dot navy"></i>Most-named competitor in that city</span><span class="muted">Share of the city's 35 AI answers</span></div>
    <div class="panel">${svg}</div>
    ${src(SRC_ANS)}`);
}

// ─── The plan ───────────────────────────────────────────────────────────────
slide('plan-intro', 'accent', `
  <p class="eyebrow on-accent rise" style="--d:0ms">The plan</p>
  <h2 class="display on-accent rise" style="--d:120ms">How LHD gets on every shortlist</h2>
  <p class="lede on-accent rise" style="--d:260ms">Five workstreams, each tied to a gap in the data. Sydney comes first, then Brisbane and Adelaide, where LHD is almost invisible.</p>`, { dark: true });

const WS = [
  ['01', 'Get ranked where AI looks', "Doyle's Guide, LawConnect, Lawzana and Best Lawyers are cited in 26 to 39 answers each. LHD is Third Tier in Doyle's NSW work injury ranking.", "Doyle's and Best Lawyers submissions, complete directory profiles, placements in “best lawyers in [city]” articles."],
  ['02', 'Win Google Maps in every office city', 'LHD is in 1 of 7 Sydney map packs and none in Brisbane or Adelaide. Canberra has 4 reviews and Newcastle 3.', 'A review program per office, full services and categories, photos and Q&A, and Brisbane and Adelaide profiles fixed.'],
  ['03', 'Make city pages AI can quote', 'lhd.com.au is cited in 79 answers, yet the Sydney medical negligence and Melbourne TAC pages get 0 of 5. Brisbane and Adelaide have no practice pages.', 'Rewrite the existing city × practice pages and build them for Brisbane and Adelaide, naming the state scheme, the lawyers, results and FAQs.'],
  ['04', 'Fix how AI describes LHD', 'Perplexity called LHD “Lawyers, Doctors & Health”. ChatGPT quotes $220m, which the Sydney page still says. Taylor & Scott is treated as a rival.', 'One consistent set of facts across the site, schema and profiles, and Taylor & Scott folded into the LHD entity.'],
  ['05', 'Measure every month', 'AI answers change week to week. Only a fixed panel shows real movement.', 'Re-run the same 280 questions and 56 Google searches monthly, and report each city’s rank and gap.'],
];
slide('plan', 'white', `
  <header class="hd"><p class="eyebrow">The plan</p><h2 class="h1">Five workstreams, each answering a gap in the data</h2></header>
  <div class="ws">
    <div class="ws-head"><span></span><span>Workstream</span><span>What the data shows</span><span>What we will do</span></div>
    ${WS.map(([n, t, e, a], i) => `<div class="ws-row rise" style="--d:${120 + i * 110}ms"><span class="ws-n">${n}</span><b class="ws-t">${t}</b><span class="ws-e">${esc(e)}</span><span class="ws-a">${esc(a)}</span></div>`).join('')}
  </div>`);

// WS1: sources AI trusts
{
  const srcs = [['doylesguide.com', "Doyle's Guide", 39], ['lawconnect.com', 'LawConnect', 38], ['lawzana.com', 'Lawzana', 30], ['comparepersonalinjurylawyers.com.au', 'Compare Personal Injury Lawyers', 26], ['bestlawyers.com', 'Best Lawyers', 26], ['bestlawfirms.com', 'Best Law Firms', 21], ['ibtimes.com.au', 'IBTimes “best lawyers” lists', 21], ['top10lawyers.com.au', 'Top10Lawyers', 16]];
  slide('ws-sources', 'light', `
    <header class="hd"><p class="eyebrow">Workstream 01</p><h2 class="h1">AI copies its shortlist from rankings guides and directories</h2></header>
    <div class="cols-60">
      <div class="panel"><p class="chart-title">Third-party sources cited in the 280 answers (answers citing each)</p>
        ${hbars(srcs.map(([d, n, v]) => ({ name: n, n: v, suffix: '' })), 45, { showRank: false })}</div>
      <div class="actions">
        <h3 class="h3">What we will do</h3>
        <ul class="ticks">
          <li>Prepare Doyle's Guide submissions for NSW, VIC, QLD, WA and SA, starting with NSW work injury and motor vehicle (LHD is Third Tier in NSW work injury).</li>
          <li>Complete and align LHD's LawConnect, Lawzana and Best Lawyers profiles for every office city.</li>
          <li>Pitch LHD into the “best personal injury lawyers in [city]” articles that Claude and ChatGPT cite.</li>
        </ul>
        <p class="note">Doyle's rankings come from peer votes, so the work is submissions and referees, not payment.</p>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// WS2: Google Maps
{
  const rev = { sydney: 421, melbourne: 170, perth: 372, canberra: 4, newcastle: 3, hobart: 127 };
  slide('ws-maps', 'white', `
    <header class="hd"><p class="eyebrow">Workstream 02</p><h2 class="h1">Google Maps decides who Google's own AI names</h2></header>
    <div class="cols-60">
      <div class="panel">
        <div class="mp-head"><span>City</span><span>Map packs with LHD (of 7 searches)</span><span>LHD Google reviews</span></div>
        ${ORDER.map((c, i) => `<div class="mp-row" style="--i:${i}"><span class="mp-city">${CITY[c]}</span><span>${dots(mapPack[c], 7, 'big')}<b class="num">${mapPack[c]}/7</b></span><span class="num">${rev[c] != null ? rev[c] : '<span class="muted">not in map packs</span>'}</span></div>`).join('')}
      </div>
      <div class="actions">
        <h3 class="h3">What we will do</h3>
        <ul class="ticks">
          <li>Run a review program for every office, starting with Canberra (4 reviews) and Newcastle (3).</li>
          <li>List every practice area as a service, with photos, Q&A and weekly posts on each profile.</li>
          <li>Find out why Brisbane and Adelaide never show in the map pack, and fix the profiles.</li>
          <li>Use Taylor & Scott's Sydney profile (4.9 from 361 reviews) in line with the merger plan.</li>
        </ul>
        <p class="note">Google AI Mode named Garling & Co in 6 of 7 Sydney answers. Garling appears in 5 of 7 Sydney map packs.</p>
      </div>
    </div>
    ${src('Google map packs from 7 searches per city, 6 Oct 2026; review counts as shown in Google results and AI Mode answers.')}`);
}

// WS3: city × practice heatmap
{
  const shade5 = v => ['#FFFFFF', '#DCE4FF', '#AFC0FF', '#7C97FF', '#4D71FF', '#2251FF'][v];
  const grid = `<div class="cp" role="table" aria-label="AI answers naming LHD, by city and question">
    <div class="cp-row head" role="row"><span role="columnheader"></span>${PRAC.map(([, l]) => `<span role="columnheader">${l}</span>`).join('')}</div>
    ${ORDER.map((c, ri) => `<div class="cp-row" role="row"><span class="cp-city" role="rowheader">${CITY[c]}</span>${PRAC.map(([p], ci) => { const v = cityStats[c].byPrompt[p].lhd; return `<span role="cell" class="cp-cell pop${v === 0 ? ' zero' : ''}" style="--d:${150 + (ri * 7 + ci) * 18}ms;background:${shade5(v)};color:${v >= 3 ? '#FFFFFF' : '#111A2E'}">${v}</span>`; }).join('')}</div>`).join('')}
  </div>`;
  const zeros = ORDER.reduce((s, c) => s + PRAC.filter(([p]) => cityStats[c].byPrompt[p].lhd === 0).length, 0);
  slide('ws-pages', 'light', `
    <header class="hd"><p class="eyebrow">Workstream 03</p><h2 class="h1">${zeros} city and question pairs where no assistant names LHD</h2></header>
    <div class="cols-heat">
      <div class="panel"><p class="chart-title">Assistants naming LHD (of 5), by city and question. Outlined cells are 0.</p>${grid}</div>
      <div class="actions">
        <h3 class="h3">What we will do</h3>
        <ul class="ticks">
          <li>Rewrite the pages that already exist but get 0 of 5: Sydney medical negligence, Melbourne TAC and Melbourne medical negligence.</li>
          <li>Build practice pages for Brisbane and Adelaide, which have none today.</li>
          <li>Name the state scheme, the local lawyers, real outcomes and the questions clients ask, in plain answers AI can quote.</li>
          <li>Add LegalService and office schema with consistent names, addresses and phone numbers.</li>
          
        </ul>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// WS4: entity accuracy
slide('ws-entity', 'white', `
  <header class="hd"><p class="eyebrow">Workstream 04</p><h2 class="h1">AI gets some facts about LHD wrong</h2></header>
  <div class="quotes">
    <figure class="quote rise" style="--d:100ms"><p class="q-src">Perplexity · Hobart</p><blockquote>“<b>Lawyers, Doctors & Health (LDH)</b> — advertises Hobart public-liability and slip-and-fall claims…”</blockquote><figcaption>It cites lhd.com.au but invents the name.</figcaption></figure>
    <figure class="quote rise" style="--d:240ms"><p class="q-src">ChatGPT · Perth</p><blockquote>“They advertise 35+ years' experience and <b>$220m+ compensation settled</b> overall.”</blockquote><figcaption>LHD's Sydney office page still says “Over $220M” in its description. The homepage says $260 million.</figcaption></figure>
    <figure class="quote rise" style="--d:380ms"><p class="q-src">Claude, Perplexity, AI Mode · Sydney</p><blockquote>“<b>Taylor & Scott Lawyers</b>” recommended as a separate firm in 6 Sydney answers.</blockquote><figcaption>LHD has acquired Taylor & Scott. AI hasn't caught up.</figcaption></figure>
  </div>
  <div class="actions wide">
    <h3 class="h3">What we will do</h3>
    <ul class="ticks cols">
      <li>Publish one source of truth: firm name, figures, offices and specialists, repeated the same way on every page and profile.</li>
      <li>Add Organization and LegalService schema with sameAs links to LinkedIn, LawConnect, Doyle's Guide and Google profiles.</li>
      <li>Connect Taylor & Scott to LHD: redirects, profile updates and an announcement page that AI can find.</li>
      <li>Check the same answers each month and correct anything AI still gets wrong.</li>
    </ul>
  </div>
  ${src('Quotes from answers collected 6 Oct 2026. Site figures checked on the LHD homepage and Sydney office page the same day.')}`);

// Roadmap
{
  const lanes = [
    ['Rankings & directories', [[1, 4, "Audit listings, Doyle's & Best Lawyers submissions"], [5, 12, 'Profiles live, article placements']]],
    ['Google Maps', [[1, 3, 'Fix Brisbane & Adelaide profiles'], [4, 12, 'Review program, every office']]],
    ['City pages', [[2, 6, 'Rewrite Sydney & Melbourne gaps'], [7, 12, 'Build Brisbane & Adelaide practice pages']]],
    ['Entity & facts', [[1, 3, 'Facts, schema, Taylor & Scott'], [4, 12, 'Ongoing corrections']]],
    ['Measurement', [[1, 12, 'Baseline in week 1, then the same 280 questions re-run in weeks 4, 8 and 12', 'light']]],
  ];
  const W = 1240, lab = 330, col = (W - lab) / 12;
  const gantt = `<div class="gantt">
    <div class="g-head" style="grid-template-columns:${lab}px repeat(12, 1fr)"><span></span>${Array.from({ length: 12 }, (_, i) => `<span>W${i + 1}</span>`).join('')}</div>
    ${lanes.map(([name, bars], li) => `<div class="g-lane"><span class="g-name">${name}</span><div class="g-track">${bars.map(([a, b, t, kind], bi) => `<div class="g-bar ${kind === 'light' ? 'milestone' : ''} grow-x" style="left:${(a - 1) / 12 * 100}%;width:${(b - a + 1) / 12 * 100}%;--d:${200 + (li * 2 + bi) * 90}ms"><span>${esc(t)}</span></div>`).join('')}</div></div>`).join('')}
    <div class="g-phases"><span style="width:33.33%">Month 1: fix foundations</span><span style="width:33.33%">Month 2: build pages & profiles</span><span style="width:33.34%">Month 3: scale to every city</span></div>
  </div>`;
  slide('roadmap', 'light', `
    <header class="hd"><p class="eyebrow">First 90 days</p><h2 class="h1">The first 90 days, week by week</h2></header>
    <div class="panel">${gantt}</div>
    <p class="note wide">Sydney leads every workstream in month 1. Brisbane and Adelaide follow in months 2 and 3, and Hobart's setup is the template for all of them.</p>`);
}

// Targets
{
  const labels = ['Oct 26', 'Jan 27', 'Apr 27', 'Oct 27'];
  const xs = [0, 3, 6, 12];
  const w = 1000, h = 560, pl = 90, pr = 230, pt = 40, pb = 80;
  const x = m => pl + m / 12 * (w - pl - pr), y = v => pt + (h - pt - pb) * (1 - v / 100);
  const target = [26, 45, 60, 80];
  const svg = `<svg class="chart" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Sydney target path">
    ${[0, 25, 50, 75, 100].map(t => `<line x1="${pl}" x2="${w - pr}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${pl - 16}" y="${y(t) + 8}" class="ax" text-anchor="end">${t}%</text>`).join('')}
    ${xs.map((m, i) => `<text x="${x(m)}" y="${h - pb + 42}" class="ax" text-anchor="middle">${labels[i]}</text>`).join('')}
    <line x1="${x(0)}" x2="${x(12)}" y1="${y(77)}" y2="${y(77)}" stroke="#1F2A44" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" class="fadein"/>
    <text x="${x(12) + 22}" y="${y(77) + 38}" class="el">Law Partners today <tspan class="elv">77%</tspan></text>
    <path d="${target.map((v, i) => `${i ? 'L' : 'M'}${x(xs[i])},${y(v)}`).join('')}" pathLength="1" class="draw" fill="none" stroke="#2251FF" stroke-width="6" stroke-dasharray="1" style="--d:300ms"/>
    <path d="${target.map((v, i) => `${i ? 'L' : 'M'}${x(xs[i])},${y(v)}`).join('')}" fill="none" stroke="#F3F5F9" stroke-width="7" stroke-dasharray="14 12" class="fadein" style="--d:1500ms"/>
    ${target.map((v, i) => `<circle cx="${x(xs[i])}" cy="${y(v)}" r="${i ? 10 : 13}" fill="${i ? '#F3F5F9' : '#2251FF'}" stroke="#2251FF" stroke-width="5" class="pop" style="--d:${400 + i * 350}ms"/><text x="${i ? x(xs[i]) : x(xs[i]) + 26}" y="${i ? y(v) - 28 : y(v) + 44}" text-anchor="${i ? 'middle' : 'start'}" class="callsmall blue">${i === 3 ? '' : v + '%'}${i ? '' : ' measured today'}</text>`).join('')}
    <text x="${x(12) + 22}" y="${y(80) - 4}" class="el blue-t">LHD target <tspan class="elv">80%</tspan></text>
  </svg>`;
  const TG = [['sydney', '45% · top 5', '60% · top 3'], ['melbourne', '50% · top 3', '65% · top 2'], ['brisbane', '20% · top 10', '40% · top 5'], ['perth', '65% · #1', '75% · #1'], ['adelaide', '20% · top 10', '35% · top 5'], ['canberra', '50% · top 3', '65% · top 2'], ['newcastle', '45% · top 5', '60% · top 3'], ['hobart', 'Hold #1', 'Hold #1']];
  slide('targets', 'light', `
    <header class="hd"><p class="eyebrow">Proposed targets</p><h2 class="h1">The goal: overtake Law Partners in Sydney within 12 months</h2></header>
    <div class="cols-60">
      <div class="panel"><p class="chart-title">Sydney: share of AI answers naming LHD. Today's figure is measured; the dashed path is the target.</p>${svg}</div>
      <div>
        <table class="tg-table">
          <thead><tr><th>City</th><th>Today</th><th>90 days</th><th>6 months</th></tr></thead>
          <tbody>${TG.map(([c, a, b], i) => `<tr class="rise" style="--d:${200 + i * 70}ms"><td>${CITY[c]}</td><td class="num">${cityStats[c].rate}% · #${cityStats[c].lhdRank}</td><td class="num">${a}</td><td class="num">${b}</td></tr>`).join('')}</tbody>
        </table>
        <p class="note">Targets are measured on the same 280-question panel each month, so every movement is like for like.</p>
      </div>
    </div>`);
}

// Close
slide('close', 'dark close', `
  <div class="cover-bg" aria-hidden="true"></div>
  <p class="eyebrow on-dark rise" style="--d:0ms">Next steps</p>
  <h2 class="display rise" style="--d:120ms">Start with Sydney. Measure every month.</h2>
  <ol class="next rise" style="--d:300ms">
    <li><span>1</span><p><b>Agree the targets</b> and the order of cities after Sydney.</p></li>
    <li><span>2</span><p><b>Share access</b> to the Google Business Profiles, the website and the directory logins.</p></li>
    <li><span>3</span><p><b>First re-measure in early November 2026</b>, on the same 280 questions and 56 searches.</p></li>
  </ol>
  <div class="close-logo">${logo()}<span class="byline">Prepared by Uprise Digital</span></div>`, { dark: true, noFoot: true });

// Appendix
slide('appendix', 'white', `
  <header class="hd"><p class="eyebrow">Appendix</p><h2 class="h1">Method and definitions</h2></header>
  <div class="cols-2 appx">
    <div>
      <h3 class="h3">How answers were collected</h3>
      <ul class="plain">
        <li>7 questions × 8 cities, asked on 6 October 2026 (AEDT) through DataForSEO's AI Optimization and SERP APIs.</li>
        <li>ChatGPT ran with web search from Australia. Gemini and Google AI Mode were located in each city. Perplexity (Sonar) and Claude (Sonnet 4.6) ran with web search, Australian results.</li>
        <li>Each question was asked once per assistant. AI answers vary between runs, so treat single-cell results as indicative and city totals as the signal.</li>
        <li>Google results: the same 7 searches in keyword form from each city, desktop, top 20 results plus map pack and AI Overview.</li>
      </ul>
    </div>
    <div>
      <h3 class="h3">How answers were scored</h3>
      <ul class="plain">
        <li>Every law firm named in an answer was extracted, including map cards shown with the answer. Directories, regulators and insurers were excluded.</li>
        <li>Name variants were merged (for example “Law Partners Injury Lawyers” into Law Partners). A firm counts once per answer.</li>
        <li>Each LHD mention was checked against the answer text. “LHD” meaning a NSW Local Health District was not counted.</li>
        <li>Trend data: DataForSEO LLM Mentions database, Google AI answers in Australia, Aug 2025 to Sep 2026.</li>
      </ul>
    </div>
  </div>`);

// ─── Page ───────────────────────────────────────────────────────────────────
const CSS = fs.readFileSync('deck.css', 'utf8');
const JS = fs.readFileSync('deck.js', 'utf8');
const html = `<title>LHD AI Visibility Report</title>
<meta name="description" content="Where AI assistants name LHD Lawyers against competitors in 8 Australian cities, and the plan to close the gap.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Overpass:wght@300;400;500;600;700;800;900&family=Overpass+Mono:wght@400;600;700&display=swap">
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
fs.writeFileSync('out/lhd-ai-visibility.html', html);
console.log('slides', slides.length, 'bytes', html.length);
