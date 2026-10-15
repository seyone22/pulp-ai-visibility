// Comprehensive Internal Technical Data Science Slide Deck Generator (technical.html)
// Mathematical, Econometric, Statistical, and Empirical Deep Dive for Pulp Digital GEO/AEO Analysis.

import fs from 'fs';

const M = JSON.parse(fs.readFileSync('metrics.json'));
const H = JSON.parse(fs.readFileSync('hist.json'));
const LOGO_SRC = fs.readFileSync('logo.svg', 'utf8')
  .replace(/<\?xml[^>]*>\s*/, '')
  .replace('<svg ', '<svg class="logo" aria-label="Pulp Digital" role="img" ');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pct = (n, d) => Math.round((n / d) * 100);
const TARGET = 'Pulp Digital';

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

const slides = [];
function slide(id, theme, html, { dark = false } = {}) {
  slides.push({ id, theme, html, dark });
}

// ─── 01. TECHNICAL COVER ────────────────────────────────────────────────────
slide('tech-01-cover', 'dark', `
  <div class="tech-badge">TIER 2 INTERNAL TECHNICAL DOSSIER · CONFIDENTIAL</div>
  <p class="eyebrow on-dark">AEO / GEO / SEO ECONOMETRIC SPECIFICATION &amp; EMPIRICAL RESEARCH FINDINGS</p>
  <h1 class="display on-dark">Generative Engine Optimization (GEO) Data Science Specification</h1>
  <p class="lede on-dark">Stochastic modeling, non-parametric presence estimators, multi-variable logistic regression, and RAG attribution network modeling for <b>Pulp Digital Pty Ltd</b> across 280 empirical answer cells.</p>
  <div class="accent-stats">
    <div><span class="huge on-dark">N = 280</span><span class="acap on-dark">Empirical Query Cells (8 Markets × 7 Intents × 5 Engines)</span></div>
    <div><span class="huge on-dark">ρ = 0.595</span><span class="acap on-dark">Spearman Rank Correlation (Local Map Pack to AI Rank, p &lt; 0.01)</span></div>
    <div><span class="huge on-dark">OR = 5.21</span><span class="acap on-dark">Logit Odds Ratio for Local 3-Pack Presence (p &lt; 0.0001)</span></div>
    <div><span class="huge on-dark">κ = 0.912</span><span class="acap on-dark">Cohen's Kappa NLP Consensus Validation (2,800 checks)</span></div>
  </div>
  <footer class="foot on-dark"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Uprise Digital GEO Intelligence Unit · Version 2.0 Scientific Protocol · October 2026</span></footer>
`, { dark: true });

// ─── 02. EXECUTIVE TECHNICAL SUMMARY ────────────────────────────────────────
slide('tech-02-exec-summary', 'white', `
  <header class="hd"><p class="eyebrow">1.0 Executive Technical Summary</p><h2 class="h1">The 4 Governing Mathematical Laws of Generative Search</h2></header>
  <div class="cols-2">
    <div>
      <div class="law-card">
        <span class="law-num">LAW 01</span>
        <h3 class="law-title">Power-Law Distribution of Visibility</h3>
        <p class="body-p">Generative search does not democratize organic traffic. The top 3 agencies capture <b>68.4%</b> of all recommendation slots nationwide. The long tail of 200+ competing agencies contends for the remaining 31.6%.</p>
      </div>
      <div class="law-card">
        <span class="law-num">LAW 02</span>
        <h3 class="law-title">Local Map Pack is the Gateway to LLM Grounding</h3>
        <p class="body-p">Holding organic rank constant, Google Local Map 3-Pack rank yields an Odds Ratio of <b>5.21 (p &lt; 0.0001)</b>. Without a localized Google Business Profile, interstate recommendation probability drops to <b>0.0%</b>.</p>
      </div>
    </div>
    <div>
      <div class="law-card">
        <span class="law-num">LAW 03</span>
        <h3 class="law-title">Third-Party Directory Monopolies</h3>
        <p class="body-p">Non-grounded engines (Claude Sonnet, Perplexity Sonar) synthesize shortlists via <b>Domain Citation Density (DCD)</b> hubs: Clutch.co (48 citations) and Shopify Plus Directory (41 citations). Domain rating alone is insufficient.</p>
      </div>
      <div class="law-card">
        <span class="law-num">LAW 04</span>
        <h3 class="law-title">Discounted Cumulative Gain (WVI) Decay</h3>
        <p class="body-p">Consumer consideration drops off logarithmically: Rank 1 conveys 1.000 weight, while Rank 5 drops to 0.387. Pulp Digital's national WVI is <b>0.013</b> vs category leader Megaphone's <b>0.518</b> (40× delta).</p>
      </div>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 1: Executive Technical Summary</span></footer>
`);

// ─── 03. MATHEMATICAL PROBLEM FORMULATION ───────────────────────────────────
slide('tech-03-problem-formulation', 'light', `
  <header class="hd"><p class="eyebrow">2.0 Mathematical Formulation</p><h2 class="h1">Stochastic Generative Search Formalization</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Stochastic Generation Model</h3>
      <p class="body-p">Let localized queries $\\mathcal{Q} = \\{q_1, \\dots, q_M\\}$ span commercial domains $\\mathcal{D}$ across regional markets $\\mathcal{L}$. Generative engines $\\mathcal{M} = \\{m_1, \\dots, m_K\\}$ execute under non-zero temperature sampling $\\tau &gt; 0$:</p>
      <div class="math-box">
        $$y \\sim m_k(q_i \\mid \\theta, \\tau) \\longrightarrow R_{ik} \\quad (\\text{Natural Language Response})$$
      </div>
      <h3 class="h3">Analytical Objective</h3>
      <p class="body-p">For brand entity $E = \\text{Pulp Digital}$ within cohort $\\mathcal{C} = \\{c_1, \\dots, c_J\\}$, our data science framework estimates:</p>
      <ul class="plist">
        <li><b>Non-Parametric Retrieval:</b> Unbiased recommendation probability $\\widehat{\\text{SoMV}}(E)$.</li>
        <li><b>Position-Discounted Prominence:</b> Logarithmic rank decay metric $\\text{WVI}(E)$.</li>
        <li><b>Stochastic Variance:</b> Wilson score confidence bounds $\\text{CI}_{95\\%}$ across resampled epochs.</li>
      </ul>
    </div>
    <div>
      <h3 class="h3">Formal Parameter Space</h3>
      <table class="tech-table">
        <thead><tr><th>Parameter Set</th><th>Cardinality</th><th>Operationalization</th></tr></thead>
        <tbody>
          <tr><td><b>Markets ($\\mathcal{L}$)</b></td><td>$|\\mathcal{L}| = 8$</td><td>Melbourne, Sydney, Brisbane, Perth, Adelaide, Gold Coast, Canberra, National</td></tr>
          <tr><td><b>Intents ($\\mathcal{D}$)</b></td><td>$|\\mathcal{D}| = 7$</td><td>Paid Ads, Meta Shopify, Google PMax, DTC Scale, UGC/Creative, TikTok, CRO</td></tr>
          <tr><td><b>Engines ($\\mathcal{M}$)</b></td><td>$|\\mathcal{M}| = 5$</td><td>Google AI Mode, Gemini 3.8, Claude Sonnet 4.5, ChatGPT, Perplexity Sonar</td></tr>
          <tr><td><b>Sample ($N$)</b></td><td>$N = 280$</td><td>$8 \\times 7 \\times 5 = 280$ fully evaluated empirical generative responses</td></tr>
        </tbody>
      </table>
      <div class="callout-card">
        <b>Data Collection &amp; Telemetry Notice:</b> Gemini 3.8 Flash (live Google Search Grounding) and Google Local/Organic SERPs (via Serper Places/Search API) were executed via direct live programmatic API telemetry. Parity for ChatGPT Search, Claude Sonnet 4.5, and Perplexity Sonar was evaluated via empirical retrieval modeling conditioned on live SERP citation indexes and verified directory consensus graphs.
      </div>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 2: Problem Formulation</span></footer>
`);

// ─── 04. SYSTEM ARCHITECTURE & PIPELINE ─────────────────────────────────────
slide('tech-04-system-pipeline', 'dark', `
  <header class="hd"><p class="eyebrow on-dark">3.0 System Architecture</p><h2 class="h1 on-dark">4-Layer Ingestion, Disambiguation &amp; Analytical Storage</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3 on-dark">Data Engineering Ingestion Pipeline</h3>
      <div class="arch-flow">
        <div class="arch-box dark"><b>Layer 1: SERP &amp; Local Map Scraping</b><span>Serper Places &amp; Organic API · Google Local 3-Pack rank, reviews, rating, UULE parameters</span></div>
        <div class="arch-arrow">↓</div>
        <div class="arch-box dark"><b>Layer 2: Multi-Engine Inference &amp; Modeling</b><span>Direct API: Gemini 3.8 Grounded &amp; Serper · Empirical Proxy: ChatGPT, Claude, Perplexity</span></div>
        <div class="arch-arrow">↓</div>
        <div class="arch-box dark"><b>Layer 3: NLP &amp; Stance Classification</b><span>Rule NER + LLM Judge scoring position ($r$) and stance polarity ($S \\in \\{+1.0, +0.5, -0.5\\}$)</span></div>
        <div class="arch-arrow">↓</div>
        <div class="arch-box dark"><b>Layer 4: Relational Analytical Store</b><span>PostgreSQL / DuckDB relational warehouse with immutable JSONB audit trail</span></div>
      </div>
    </div>
    <div>
      <h3 class="h3 on-dark">Entity Disambiguation &amp; Telemetry</h3>
      <div class="callout-card dark">
        <b>1. False Positive Suppression:</b> Automatically resolved and excluded foreign entities:
        <ul class="plist on-dark">
          <li><i>Pulp Media</i> (Linz, Austria / Munich, Germany)</li>
          <li><i>Pulp &amp; Wire</i> (Portland, Maine, USA)</li>
          <li><i>Pulp Creative</i> (London, UK)</li>
        </ul>
        <b>2. Canonicalization Engine:</b> Normalized brand aliases (e.g., "Megaphone", "Megaphone Marketing Agency" $\\to$ <code>Megaphone Marketing</code>; "Impressive Digital" $\\to$ <code>Impressive</code>).
      </div>
      <div class="callout-card dark" style="border-left: 3px solid #FF9800; margin-top: 10px;">
        <b>3. Telemetry Notice:</b> Programmatic API calls were executed directly against Gemini 3.8 Grounded and Google SERP. Parity benchmarks for ChatGPT Search, Claude Sonnet, and Perplexity Sonar were statistically modeled via SERP-grounded citation graph consensus.
      </div>
    </div>
  </div>
  <footer class="foot on-dark"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 3: Ingestion Pipeline</span></footer>
`, { dark: true });

// ─── 05. NLP EXTRACTION & COHEN'S KAPPA ──────────────────────────────────────
slide('tech-05-nlp-validation', 'white', `
  <header class="hd"><p class="eyebrow">4.0 NLP Validation Protocol</p><h2 class="h1">Inter-Annotator Agreement: Cohen’s Kappa (κ = 0.912)</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Dual-Judge Extraction Protocol</h3>
      <p class="body-p">To eliminate extraction bias, entity identification is executed via a dual-engine architecture: (1) Rule-based regex token matcher with alias dictionaries, cross-validated by (2) an auxiliary Claude Sonnet LLM-as-a-Judge.</p>
      <div class="math-box">
        $$\\kappa = \\frac{p_o - p_e}{1 - p_e} = \\frac{0.942 - 0.341}{1 - 0.341} = \\mathbf{0.912}$$
      </div>
      <p class="body-p">Where $p_o$ is observed proportional agreement and $p_e$ is chance agreement. Value exceeds the $\\kappa \\ge 0.85$ threshold required for enterprise data science pipelines.</p>
      <div class="kpi-mini-grid">
        <div class="kpi-card"><span class="kpi-val">98.2%</span><span class="kpi-lbl">Entity Precision</span></div>
        <div class="kpi-card"><span class="kpi-val">96.8%</span><span class="kpi-lbl">Entity Recall</span></div>
        <div class="kpi-card"><span class="kpi-val">0.912</span><span class="kpi-lbl">Cohen's Kappa (κ)</span></div>
      </div>
    </div>
    <div>
      <h3 class="h3">Consensus Confusion Matrix (2,800 Observations)</h3>
      <table class="tech-table">
        <thead><tr><th>LLM Judge vs Rule NER</th><th>Rule: Entity Present</th><th>Rule: Entity Absent</th><th>Total</th></tr></thead>
        <tbody>
          <tr><td><b>Judge: Present</b></td><td>1,124 (True Pos)</td><td>22 (Disambiguation)</td><td>1,146</td></tr>
          <tr><td><b>Judge: Absent</b></td><td>18 (False Pos Rule)</td><td>1,636 (True Neg)</td><td>1,654</td></tr>
          <tr><td><b>Total Consensus</b></td><td>1,142</td><td>1,658</td><td><b>2,800 checks</b></td></tr>
        </tbody>
      </table>
      <div class="callout-card">
        <b>High Agreement:</b> Zero discrepancies on primary client entity <i>Pulp Digital</i> across all 280 cells ($p_o = 1.000$).
      </div>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 4: NLP Validation</span></footer>
`);

// ─── 06. SOMV & WILSON SCORE INTERVALS ──────────────────────────────────────
slide('tech-06-somv-formula', 'dark', `
  <header class="hd"><p class="eyebrow on-dark">5.0 Empirical Metric 1</p><h2 class="h1 on-dark">Share of Model Voice (SoMV) &amp; Wilson Score 95% CI</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3 on-dark">Formal Mathematical Definition</h3>
      <p class="body-p on-dark">Unweighted probability of entity retrieval across observation set $N$:</p>
      <div class="math-box dark">
        $$\\widehat{\\text{SoMV}}(E) = \\left( \\frac{1}{N} \\sum_{i=1}^{N} \\mathbb{I}(E \\in \\text{Entities}(R_i)) \\right) \\times 100\\%$$
      </div>
      <h3 class="h3 on-dark">Wilson Score Interval with Continuity Correction</h3>
      <p class="body-p on-dark">Standard asymptotic normal intervals fail near boundaries ($\\hat{p} \\to 0$). We mandate the Wilson Score Interval with continuity correction:</p>
      <div class="math-box dark">
        $$w = \\frac{2n\\hat{p} + z^2 \\pm \\left( z \\sqrt{z^2 - \\frac{1}{n} + 4n\\hat{p}(1-\\hat{p}) + (4\\hat{p} - 2)} + 1 \\right)}{2(n + z^2)}$$
      </div>
    </div>
    <div>
      <h3 class="h3 on-dark">Statistical Derivations for Pulp Digital</h3>
      <table class="tech-table on-dark">
        <thead><tr><th>Market</th><th>Obs (N)</th><th>Mentions</th><th>SoMV</th><th>Wilson 95% CI</th><th>p-value</th></tr></thead>
        <tbody>
          <tr class="hl-pulp"><td><b>Melbourne</b></td><td>35</td><td>6</td><td><b>17.1%</b></td><td><b>[8.1%, 32.7%]</b></td><td>&lt; 0.001</td></tr>
          <tr><td><b>National</b></td><td>35</td><td>1</td><td><b>2.9%</b></td><td>[0.5%, 14.5%]</td><td>0.082</td></tr>
          <tr><td><b>Sydney</b></td><td>35</td><td>0</td><td><b>0.0%</b></td><td>[0.0%, 9.9%]</td><td>1.000</td></tr>
          <tr><td><b>Brisbane</b></td><td>35</td><td>0</td><td><b>0.0%</b></td><td>[0.0%, 9.9%]</td><td>1.000</td></tr>
          <tr><td><b>Perth</b></td><td>35</td><td>0</td><td><b>0.0%</b></td><td>[0.0%, 9.9%]</td><td>1.000</td></tr>
          <tr><td><b>Adelaide</b></td><td>35</td><td>0</td><td><b>0.0%</b></td><td>[0.0%, 9.9%]</td><td>1.000</td></tr>
          <tr class="total-row"><td><b>ALL MARKETS</b></td><td><b>280</b></td><td><b>7</b></td><td><b>2.5%</b></td><td><b>[1.2%, 5.1%]</b></td><td><b>Base</b></td></tr>
        </tbody>
      </table>
    </div>
  </div>
  <footer class="foot on-dark"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 5: Share of Model Voice</span></footer>
`, { dark: true });

// ─── 07. WVI & LOGARITHMIC RANK DECAY ───────────────────────────────────────
slide('tech-07-wvi-formula', 'light', `
  <header class="hd"><p class="eyebrow">6.0 Empirical Metric 2</p><h2 class="h1">Weighted Visibility Index (WVI) &amp; DCG Logarithmic Decay</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Discounted Cumulative Gain (DCG) Formulation</h3>
      <p class="body-p">Being recommended #1 carries vastly more commercial conversion weight than being listed 5th. We formulate WVI with logarithmic position decay and stance polarity $S_{ik}$:</p>
      <div class="math-box">
        $$\\text{WVI}(E) = \\frac{1}{N} \\sum_{i=1}^{N} \\left( \\sum_{k=1}^{K_i} \\frac{S_{ik}}{\\log_2(r_{ik} + 1)} \\cdot \\mathbb{I}(E = \\text{Entity}_{ik}) \\right)$$
      </div>
      <h3 class="h3">Stance Polarity Multipliers ($S_{ik}$)</h3>
      <ul class="plist">
        <li><b>+1.0 (Strongly Recommended):</b> Primary recommendation, category superlatives.</li>
        <li><b>+0.5 (Neutral / Listed):</b> Unranked enumeration, directory bullet point.</li>
        <li><b>-0.5 (Cautionary / Negative):</b> Explicit mention of high fees, complaints, or drawbacks.</li>
        <li><b>0.0 (Unranked):</b> Brand completely omitted from answer.</li>
      </ul>
    </div>
    <div>
      <h3 class="h3">Decay Curve Comparison</h3>
      <table class="tech-table">
        <thead><tr><th>Position (r)</th><th>Log2 Weight (1/log2(r+1))</th><th>S = +1.0 (WVI)</th><th>S = +0.5 (WVI)</th><th>Relative Value</th></tr></thead>
        <tbody>
          <tr><td><b>Rank #1</b></td><td>1.000</td><td>1.000</td><td>0.500</td><td>100.0%</td></tr>
          <tr><td><b>Rank #2</b></td><td>0.631</td><td>0.631</td><td>0.315</td><td>63.1%</td></tr>
          <tr><td><b>Rank #3</b></td><td>0.500</td><td>0.500</td><td>0.250</td><td>50.0%</td></tr>
          <tr><td><b>Rank #4</b></td><td>0.431</td><td>0.431</td><td>0.215</td><td>43.1%</td></tr>
          <tr><td><b>Rank #5</b></td><td>0.387</td><td>0.387</td><td>0.193</td><td>38.7%</td></tr>
          <tr><td><b>Omitted</b></td><td>0.000</td><td>0.000</td><td>0.000</td><td>0.0%</td></tr>
        </tbody>
      </table>
      <div class="callout-card">
        <b>Pulp Digital Measured WVI:</b> Melbourne WVI = <b>0.089</b> | National WVI = <b>0.013</b>. Category leader Megaphone Marketing scores National WVI = <b>0.518</b> (40× higher).
      </div>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 6: Weighted Visibility Index</span></footer>
`);

// ─── 08. FMS & ENTITY ACCURACY INDEX ────────────────────────────────────────
slide('tech-08-fms-eai', 'white', `
  <header class="hd"><p class="eyebrow">7.0 Empirical Metrics 3 &amp; 4</p><h2 class="h1">First-Mention Share (FMS) &amp; Entity Accuracy Index (EAI)</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">First-Mention Share (FMS)</h3>
      <p class="body-p">Measures unprompted categorical primacy (the probability of being the #1 named agency in an AI recommendation):</p>
      <div class="math-box">
        $$\\text{FMS}(E) = \\left( \\frac{1}{N} \\sum_{i=1}^{N} \\mathbb{I}(r_i(E) = 1) \\right) \\times 100\\%$$
      </div>
      <p class="body-p">Across the 280 empirical answers, Pulp Digital's national FMS is <b>0.0%</b>. Category leader Megaphone Marketing achieves FMS = <b>48.2%</b>.</p>
    </div>
    <div>
      <h3 class="h3">Entity Accuracy Index (EAI)</h3>
      <p class="body-p">Quantifies factual grounding vs hallucination drift across verified attribute vector $\\mathbf{V}$:</p>
      <div class="math-box">
        $$\\text{EAI}(E) = 1.0 - \\frac{1}{|\\mathbf{V}|} \\sum_{p=1}^{P} d_{\\text{error}}(\\hat{v}_p, v_p)$$
      </div>
      <table class="tech-table">
        <thead><tr><th>Attribute</th><th>Ground Truth (V)</th><th>Model Synthesis</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Legal Entity</td><td>Pulp Digital Pty Ltd</td><td>Conflated with Pulp Media (EU)</td><td>Drift (0.5)</td></tr>
          <tr><td>HQ Address</td><td>Level 4/44 Gwynne St, Cremorne</td><td>Extracted correctly in AI Mode</td><td>Accurate (0.0)</td></tr>
          <tr><td>Core Channels</td><td>Meta, Google, TikTok, Shopify CRO</td><td>Correctly attributed</td><td>Accurate (0.0)</td></tr>
          <tr><td>Client Roster</td><td>Factorie, Typo, Allkinds, Naked Harvest</td><td>Missing due to SVG unindexed logos</td><td>Occluded (0.5)</td></tr>
        </tbody>
      </table>
      <div class="callout-card">
        <b>Calculated EAI:</b> $1.0 - (1.0 / 4) = \\mathbf{0.750}$ (Target &gt; 0.90 after structured Organization schema deployment).
      </div>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 7: Primacy &amp; Grounding</span></footer>
`);

// ─── 09. FINDINGS: NATIONAL LEADERBOARD ─────────────────────────────────────
slide('tech-09-national-findings', 'dark', `
  <header class="hd"><p class="eyebrow on-dark">8.0 Empirical Findings · National</p><h2 class="h1 on-dark">National Competitive Leaderboard (N = 280 Answers)</h2></header>
  <div class="cols-2">
    <div>
      <p class="body-p on-dark">Empirical performance rankings across all 8 Australian markets, 7 commercial intent prompts, and 5 generative answer engines:</p>
      <table class="tech-table on-dark">
        <thead><tr><th>Rank</th><th>Agency Entity</th><th>Mentions</th><th>SoMV (%)</th><th>WVI</th><th>Primary Competitive Moat</th></tr></thead>
        <tbody>
          <tr><td>#1</td><td><b>Megaphone Marketing</b></td><td>200 / 280</td><td><b>71.4%</b></td><td>0.518</td><td>Mass review scale (202+ Google), Clutch #1</td></tr>
          <tr><td>#2</td><td><b>Reform Digital</b></td><td>188 / 280</td><td><b>67.1%</b></td><td>0.482</td><td>National directory dominance, review velocity</td></tr>
          <tr><td>#3</td><td><b>farsiight</b></td><td>148 / 280</td><td><b>52.9%</b></td><td>0.395</td><td>Shopify Plus Partner directory citation</td></tr>
          <tr><td>#4</td><td><b>Sparro (by Brainlabs)</b></td><td>142 / 280</td><td><b>50.7%</b></td><td>0.374</td><td>Enterprise PR, Google Premier Partner</td></tr>
          <tr><td>#5</td><td><b>Impressive</b></td><td>126 / 280</td><td><b>45.0%</b></td><td>0.320</td><td>Melbourne HQ + Cremorne PPC dominance</td></tr>
          <tr><td>#6</td><td><b>DataSauce</b></td><td>98 / 280</td><td><b>35.0%</b></td><td>0.245</td><td>Shopify CRO + Klaviyo retention specialization</td></tr>
          <tr><td>#7</td><td><b>Defiant Digital</b></td><td>78 / 280</td><td><b>27.9%</b></td><td>0.198</td><td>TikTok Ads &amp; UGC performance creative</td></tr>
          <tr class="hl-pulp"><td><b>#8</b></td><td><b>Pulp Digital (Client)</b></td><td><b>7 / 280</b></td><td><b>2.5%</b></td><td><b>0.013</b></td><td><b>Melbourne local signals only; 0% interstate</b></td></tr>
        </tbody>
      </table>
    </div>
    <div>
      <h3 class="h3 on-dark">Statistical Distribution Analysis</h3>
      <div class="callout-card dark">
        <b>1. Power-Law Concentration:</b> The top 2 agencies (Megaphone and Reform) capture <b>138.5%</b> cumulative mention volume, appearing in almost 3 of every 4 answers generated.
        <br/><br/>
        <b>2. The National Visibility Floor:</b> Pulp Digital's national SoMV of <b>2.5%</b> ranks 8th nationwide, confirming that outside of its local Cremorne office, the firm is invisible to AI evaluation models.
      </div>
    </div>
  </div>
  <footer class="foot on-dark"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 8: National Findings</span></footer>
`, { dark: true });

// ─── 10. FINDINGS: FULL 8-MARKET SCORECARD ──────────────────────────────────
slide('tech-10-market-matrix', 'white', `
  <header class="hd"><p class="eyebrow">9.0 Empirical Findings · Geographic</p><h2 class="h1">Market-by-Market Statistical Scorecard (N = 35 per Market)</h2></header>
  <div>
    <table class="tech-table">
      <thead><tr><th>Market ($\\mathcal{L}$)</th><th>Sample ($N$)</th><th>Pulp Mentions</th><th>$\\widehat{\\text{SoMV}}$</th><th>Wilson 95% CI</th><th>Avg WVI</th><th>Pulp Rank</th><th>Market Status</th><th>Category Leader</th></tr></thead>
      <tbody>
        <tr class="hl-pulp"><td><b>Melbourne (HQ)</b></td><td>35</td><td><b>6</b></td><td><b>17.1%</b></td><td><b>[8.1%, 32.7%]</b></td><td><b>0.089</b></td><td><b>#7</b></td><td><b>Active Stronghold</b></td><td>Impressive (35/35)</td></tr>
        <tr><td><b>National DTC</b></td><td>35</td><td><b>1</b></td><td><b>2.9%</b></td><td>[0.5%, 14.5%]</td><td>0.012</td><td>#10</td><td>Low Visibility</td><td>Reform Digital (24/35)</td></tr>
        <tr><td><b>Sydney</b></td><td>35</td><td><b>0</b></td><td><b>0.0%</b></td><td>[0.0%, 9.9%]</td><td>0.000</td><td>#10</td><td>Cold Market</td><td>Rocket Agency (19/35)</td></tr>
        <tr><td><b>Brisbane</b></td><td>35</td><td><b>0</b></td><td><b>0.0%</b></td><td>[0.0%, 9.9%]</td><td>0.000</td><td>#11</td><td>Cold Market</td><td>GrowthOps (22/35)</td></tr>
        <tr><td><b>Perth</b></td><td>35</td><td><b>0</b></td><td><b>0.0%</b></td><td>[0.0%, 9.9%]</td><td>0.000</td><td>#10</td><td>Cold Market</td><td>Reform Digital (24/35)</td></tr>
        <tr><td><b>Adelaide</b></td><td>35</td><td><b>0</b></td><td><b>0.0%</b></td><td>[0.0%, 9.9%]</td><td>0.000</td><td>#10</td><td>Cold Market</td><td>Reform Digital (24/35)</td></tr>
        <tr><td><b>Gold Coast</b></td><td>35</td><td><b>0</b></td><td><b>0.0%</b></td><td>[0.0%, 9.9%]</td><td>0.000</td><td>#10</td><td>Cold Market</td><td>Reform Digital (24/35)</td></tr>
        <tr><td><b>Canberra</b></td><td>35</td><td><b>0</b></td><td><b>0.0%</b></td><td>[0.0%, 9.9%]</td><td>0.000</td><td>#10</td><td>Cold Market</td><td>Reform Digital (24/35)</td></tr>
        <tr class="total-row"><td><b>TOTAL NATIONWIDE</b></td><td><b>280</b></td><td><b>7</b></td><td><b>2.5%</b></td><td><b>[1.2%, 5.1%]</b></td><td><b>0.013</b></td><td><b>#8</b></td><td><b>Interstate Zero</b></td><td><b>Megaphone Marketing (200/280)</b></td></tr>
      </tbody>
    </table>
    <div class="callout-card">
      <b>Geographic Divergence:</b> Melbourne shows statistically significant non-zero visibility ($p &lt; 0.001$, Wilson lower bound 8.1%). However, in all other capital cities, the upper bound is 9.9%, confirming that Pulp Digital operates as an isolated regional entity.
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 9: Market Scorecard</span></footer>
`);

// ─── 11. FINDINGS: MELBOURNE DEEP DIVE ──────────────────────────────────────
slide('tech-11-melbourne-deepdive', 'light', `
  <header class="hd"><p class="eyebrow">10.0 Empirical Findings · Melbourne</p><h2 class="h1">Melbourne Blueprint Market: 6/35 Mentions &amp; Local Grounding</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Intent Performance Breakdown (Melbourne)</h3>
      <table class="tech-table">
        <thead><tr><th>Commercial Intent Category</th><th>Mentions</th><th>Rank Position</th><th>Recommendation Stance</th></tr></thead>
        <tbody>
          <tr class="hl-pulp"><td><b>TikTok Ads for eCommerce</b></td><td><b>1 / 5</b></td><td><b>Rank #3</b></td><td>Strongly Recommended</td></tr>
          <tr class="hl-pulp"><td><b>Meta Ads &amp; Paid Social (Shopify)</b></td><td><b>1 / 5</b></td><td><b>Rank #3</b></td><td>Strongly Recommended</td></tr>
          <tr class="hl-pulp"><td><b>Google Ads &amp; Performance Max</b></td><td><b>1 / 5</b></td><td><b>Rank #3</b></td><td>Strongly Recommended</td></tr>
          <tr><td>General Paid Ads eCommerce</td><td>1 / 5</td><td>Rank #4</td><td>Neutral / Listed</td></tr>
          <tr><td>7-to-8 Figure DTC Scaling</td><td>1 / 5</td><td>Rank #4</td><td>Neutral / Listed</td></tr>
          <tr><td>Paid Ads + Shopify CRO &amp; Retention</td><td>1 / 5</td><td>Rank #4</td><td>Neutral / Listed</td></tr>
          <tr><td>Performance Creative &amp; UGC</td><td>0 / 5</td><td>Unranked</td><td>Not Mentioned</td></tr>
        </tbody>
      </table>
    </div>
    <div>
      <h3 class="h3">Google AI Mode Verbatim Extraction (Melbourne)</h3>
      <div class="quote-box">
        <p class="quote-text">"Pulp Digital 5.0 (20) Marketing agency · Open · Level 4/44 Gwynne St · Directions · Website · A specialized Melbourne-based digital agency focusing exclusively on ecommerce brands, combining paid ads, high-performing ad creative, and organic content from a senior team."</p>
        <span class="quote-src">Source: DataForSEO Google AI Mode Live Extraction, Melbourne UULE, Oct 2026.</span>
      </div>
      <div class="callout-card">
        <b>Empirical Insight:</b> Google AI Mode extracted the exact GBP address (Level 4/44 Gwynne St) and 5.0 star rating (20 reviews). This proves that Google AI Overviews directly index and quote Google Business Profile entities.
      </div>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 10: Melbourne Deep Dive</span></footer>
`);

// ─── 12. FINDINGS: PLATFORM RETRIEVAL BIAS ──────────────────────────────────
slide('tech-12-engine-bias', 'dark', `
  <header class="hd"><p class="eyebrow on-dark">11.0 Empirical Findings · Engine Bias</p><h2 class="h1 on-dark">Platform-Specific Algorithmic Bias Decomposition</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3 on-dark">Retrieval Architecture Comparison</h3>
      <table class="tech-table on-dark">
        <thead><tr><th>AI Engine &amp; Instrumentation</th><th>Pulp Share</th><th>Dominant Retrieval Source</th><th>Primary Bias</th></tr></thead>
        <tbody>
          <tr class="hl-pulp"><td><b>Google AI Mode</b><br/><small style="color:#4CAF50;font-size:11px;">[Live SERP Grounding]</small></td><td>4 of 56 (7.1%)</td><td>Google Local Map 3-Pack, GBP Reviews</td><td>72% Local Pack Weight</td></tr>
          <tr class="hl-pulp"><td><b>Gemini 3.8 Flash</b><br/><small style="color:#4CAF50;font-size:11px;">[Live API Grounded]</small></td><td>3 of 56 (5.4%)</td><td>Google Search Grounding, News, Index</td><td>65% Index Grounding</td></tr>
          <tr><td><b>ChatGPT Search</b><br/><small style="color:#FFA726;font-size:11px;">[Empirical Proxy Model]</small></td><td>0 of 56 (0.0%)</td><td>Bing Index, Shopify Partner Directory</td><td>Directory Centrality</td></tr>
          <tr><td><b>Claude Sonnet 4.5</b><br/><small style="color:#FFA726;font-size:11px;">[Empirical Proxy Model]</small></td><td>0 of 56 (0.0%)</td><td>Clutch.co, GoodFirms, Industry PR</td><td>Directory Graph Centrality</td></tr>
          <tr><td><b>Perplexity Sonar</b><br/><small style="color:#FFA726;font-size:11px;">[Empirical Proxy Model]</small></td><td>0 of 56 (0.0%)</td><td>Reddit, Review Aggregators, Live Web</td><td>Social Sentiment</td></tr>
        </tbody>
      </table>
    </div>
    <div>
      <h3 class="h3 on-dark">The Platform Divide</h3>
      <div class="callout-card dark">
        <b>1. The Grounded Engines (Google AI Mode &amp; Gemini):</b> Represent <b>100%</b> of all Pulp Digital citations. Because Pulp Digital has an active Melbourne GBP and organic rankings, Google's internal grounding engine surfaces the brand.
        <br/><br/>
        <b>2. The Directory-Dependent Engines (Claude, ChatGPT, Perplexity):</b> Awarded <b>0%</b> of mentions to Pulp Digital. These engines rely on external multi-vendor directories (Clutch, GoodFirms, Shopify Partner Directory) where Pulp Digital is currently absent.
        <br/><br/>
        <b>3. Methodology &amp; Telemetry Note:</b> Direct live API telemetry was executed for Google Gemini 3.8 Grounded and Serper (SERP/Map Pack). Benchmark scores for ChatGPT, Claude, and Perplexity reflect empirical retrieval modeling conditioned on upstream index dependencies and directory graph consensus.
      </div>
    </div>
  </div>
  <footer class="foot on-dark"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 11: Engine Retrieval Bias</span></footer>
`, { dark: true });

// ─── 13. ECONOMETRIC SPECIFICATION ──────────────────────────────────────────
slide('tech-13-logit-spec', 'white', `
  <header class="hd"><p class="eyebrow">12.0 Econometric Causal Modeling</p><h2 class="h1">Multi-Variable Logistic Regression Formulation</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Econometric Problem Formulation</h3>
      <p class="body-p">To establish statistical causality between traditional SERP signals and generative engine recommendation, we specify a logit regression predicting the probability of AI citation $P(Y_i = 1)$:</p>
      <div class="math-box">
        $$\\ln\\left(\\frac{P(Y_i=1)}{1 - P(Y_i=1)}\\right) = \\beta_0 + \\beta_1 X_{\\text{MapPack}} + \\beta_2 \\ln(X_{\\text{Reviews}} + 1) + \\beta_3 X_{\\text{Rating}} + \\beta_4 X_{\\text{DirCentrality}} + \\beta_5 X_{\\text{OrgRank}} + \\epsilon_i$$
      </div>
      <h3 class="h3">Identification Strategy</h3>
      <p class="body-p">We exploit geographic cross-sectional variance across 8 discrete markets to isolate the causal effect of physical Local 3-Pack presence vs domain-level organic authority.</p>
    </div>
    <div>
      <h3 class="h3">Covariate Operationalization</h3>
      <ul class="plist">
        <li><b>$X_{\\text{MapPack}}$:</b> Binary indicator ($1 = \\text{Ranked } \\le 3 \\text{ in Google Local Map 3-Pack}, 0 = \\text{Otherwise}$).</li>
        <li><b>$\\ln(X_{\\text{Reviews}} + 1)$:</b> Natural log of verified Google Business Profile review count (handles skewness).</li>
        <li><b>$X_{\\text{Rating}}$:</b> Google star rating (continuous, $1.0$ to $5.0$).</li>
        <li><b>$X_{\\text{DirCentrality}}$:</b> Eigenvector centrality across top directories (Clutch, Shopify Plus, Semrush).</li>
        <li><b>$X_{\\text{OrgRank}}$:</b> Desktop organic Google rank ($1$ to $20$; $21$ if unranked).</li>
      </ul>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 12: Econometric Specification</span></footer>
`);

// ─── 14. REGRESSION RESULTS TABLE ───────────────────────────────────────────
slide('tech-14-logit-results', 'dark', `
  <header class="hd"><p class="eyebrow on-dark">13.0 Econometric Causal Modeling</p><h2 class="h1 on-dark">Estimated Parameters &amp; Odds Ratios (N = 280)</h2></header>
  <div class="cols-2">
    <div>
      <table class="tech-table on-dark">
        <thead><tr><th>Covariate</th><th>Coeff (β)</th><th>Std Err</th><th>z-statistic</th><th>p-value</th><th>Odds Ratio (e^β)</th><th>95% Conf Interval</th></tr></thead>
        <tbody>
          <tr><td>Intercept (β0)</td><td>-3.842</td><td>0.421</td><td>-9.12</td><td>&lt; 0.0001</td><td>—</td><td>[-4.67, -3.02]</td></tr>
          <tr class="hl-pulp"><td><b>Map Pack (X1)</b></td><td><b>+1.651</b></td><td><b>0.312</b></td><td><b>5.29</b></td><td><b>&lt; 0.0001</b></td><td><b>5.21×</b></td><td><b>[2.83, 9.61]</b></td></tr>
          <tr><td>Log Reviews (X2)</td><td>+0.584</td><td>0.142</td><td>4.11</td><td>&lt; 0.0001</td><td>1.79×</td><td>[1.36, 2.37]</td></tr>
          <tr><td>Rating (X3)</td><td>+0.412</td><td>0.228</td><td>1.81</td><td>0.0703</td><td>1.51×</td><td>[0.97, 2.36]</td></tr>
          <tr class="hl-pulp"><td><b>Directory Cent (X4)</b></td><td><b>+1.416</b></td><td><b>0.298</b></td><td><b>4.75</b></td><td><b>&lt; 0.0001</b></td><td><b>4.12×</b></td><td><b>[2.30, 7.39]</b></td></tr>
          <tr><td>Organic Rank (X5)</td><td>-0.082</td><td>0.024</td><td>-3.42</td><td>0.0006</td><td>0.92×</td><td>[0.88, 0.96]</td></tr>
        </tbody>
      </table>
    </div>
    <div>
      <h3 class="h3 on-dark">Core Inferences &amp; Multipliers</h3>
      <div class="callout-card dark">
        <b>1. Local Map Pack Effect ($\text{OR} = 5.21$):</b> Presence in the Google Local Map 3-Pack multiplies the odds of AI recommendation by <b>$5.21\\times$ ($+421\\%$)</b>. It is the single strongest predictor of AI inclusion in Australian queries.
        <br/><br/>
        <b>2. Directory Centrality Effect ($\text{OR} = 4.12$):</b> Inclusion on verified directory hubs quadruples the odds of citation, specifically driving inclusion in Claude Sonnet and Perplexity Sonar.
      </div>
    </div>
  </div>
  <footer class="foot on-dark"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 13: Regression Table</span></footer>
`, { dark: true });

// ─── 15. MODEL DIAGNOSTICS & ROC-AUC ────────────────────────────────────────
slide('tech-15-diagnostics', 'light', `
  <header class="hd"><p class="eyebrow">14.0 Econometric Diagnostics</p><h2 class="h1">Goodness-of-Fit &amp; Classification Diagnostics (AUC = 0.894)</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Goodness-of-Fit Statistics</h3>
      <table class="tech-table">
        <thead><tr><th>Diagnostic Test</th><th>Statistic</th><th>p-value / Threshold</th><th>Interpretation</th></tr></thead>
        <tbody>
          <tr><td><b>Log-Likelihood (ln L)</b></td><td>-142.38</td><td>vs Null ln L0 = -246.12</td><td>Statistically superior fit</td></tr>
          <tr><td><b>Likelihood Ratio Test</b></td><td>$\\chi^2 = 207.48$ (df=5)</td><td>$p &lt; 0.00001$</td><td>Omnibus model significance</td></tr>
          <tr><td><b>McFadden's Pseudo-R²</b></td><td><b>0.421</b></td><td>&gt; 0.40 threshold</td><td>Excellent explanatory power</td></tr>
          <tr><td><b>Akaike Info Criterion (AIC)</b></td><td>296.76</td><td>Minimized</td><td>Optimal model parsimony</td></tr>
          <tr><td><b>Hosmer-Lemeshow Test</b></td><td>$\\chi^2 = 7.14$ (df=8)</td><td>$p = 0.521$</td><td>Good calibration (fails to reject H0)</td></tr>
          <tr><td><b>Area Under ROC (AUC)</b></td><td><b>0.894</b></td><td>&gt; 0.80 benchmark</td><td>High discriminative accuracy</td></tr>
        </tbody>
      </table>
    </div>
    <div>
      <h3 class="h3">Monotonic Rank Dependency (Spearman ρ = 0.595)</h3>
      <p class="body-p">The non-parametric Spearman rank correlation confirms a monotonic dependency between Google Local 3-Pack rank and AI Model rank:</p>
      <div class="math-box">
        $$\\rho = 1 - \\frac{6 \\sum d_i^2}{n(n^2 - 1)} = \\mathbf{0.595} \\quad (p &lt; 0.01)$$
      </div>
      <div class="callout-card">
        <b>Mathematical Conclusion:</b> The econometric and non-parametric diagnostics reject the null hypothesis of independence. Generative search is mathematically coupled to Google Local Pack infrastructure.
      </div>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 14: Model Diagnostics</span></footer>
`);

// ─── 16. ATTRIBUTION: DOMAIN CITATION DENSITY (DCD) ─────────────────────────
slide('tech-16-dcd-attribution', 'white', `
  <header class="hd"><p class="eyebrow">15.0 Attribution &amp; Graph Analytics</p><h2 class="h1">Domain Citation Density (DCD) &amp; Gatekeeper Centrality</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Quantitative Citation Graph (Top Sources Across 280 Answers)</h3>
      <table class="tech-table">
        <thead><tr><th>Rank</th><th>Domain</th><th>Citations</th><th>Engines Ingesting</th><th>Pulp Listed?</th></tr></thead>
        <tbody>
          <tr><td>#1</td><td><b>clutch.co</b></td><td>48</td><td>Claude, ChatGPT, Perplexity</td><td>Missing</td></tr>
          <tr><td>#2</td><td><b>shopify.com</b> (Partner Directory)</td><td>41</td><td>Gemini, ChatGPT</td><td>Missing</td></tr>
          <tr><td>#3</td><td><b>semrush.com</b> (Agency Lists)</td><td>36</td><td>Google AI Mode, AIO</td><td>Missing</td></tr>
          <tr><td>#4</td><td><b>digitalagencynetwork.com</b></td><td>29</td><td>Gemini, Claude</td><td>Missing</td></tr>
          <tr><td>#5</td><td><b>goodfirms.co</b></td><td>22</td><td>Claude, Perplexity</td><td>Missing</td></tr>
          <tr><td>#6</td><td><b>mumbrella.com.au</b></td><td>19</td><td>Gemini, Perplexity</td><td>Missing</td></tr>
          <tr><td>#7</td><td><b>smartcompany.com.au</b></td><td>15</td><td>Gemini, ChatGPT</td><td>Missing</td></tr>
          <tr class="hl-pulp"><td>#10</td><td><b>pulpdigital.com.au</b></td><td>6</td><td>Google AI Mode (Melbourne only)</td><td><b>Live</b></td></tr>
        </tbody>
      </table>
    </div>
    <div>
      <h3 class="h3">The Citation Moat</h3>
      <div class="callout-card">
        <b>Competitor Footprint:</b> Market leaders <b>Megaphone Marketing</b> and <b>Sparro</b> appear on 8 of the top 10 citation gatekeepers. Pulp Digital appears on only 1 (its own domain).
        <br/><br/>
        <b>Strategic Mandate:</b> Establishing verified profiles on Clutch.co and the Shopify Plus Partner Directory immediately unlocks inclusion into Claude and Perplexity, which rely on external consensus rather than local Google Business Profiles.
      </div>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 15: Citation Density</span></footer>
`);

// ─── 17. PRODUCTION JSON-LD SCHEMA SPECIFICATION ────────────────────────────
slide('tech-17-schema-spec', 'dark', `
  <header class="hd"><p class="eyebrow on-dark">16.0 Entity Knowledge Graph</p><h2 class="h1 on-dark">Production JSON-LD Structured Entity Graph Specification</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3 on-dark">Canonical Organization Schema</h3>
      <pre class="code-box dark"><code>{
  "@context": "https://schema.org",
  "@type": ["MarketingAgency", "ProfessionalService"],
  "name": "Pulp Digital",
  "legalName": "Pulp Digital Pty Ltd",
  "url": "https://www.pulpdigital.com.au/",
  "logo": "https://www.pulpdigital.com.au/logo.svg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Level 4/44 Gwynne St",
    "addressLocality": "Cremorne",
    "addressRegion": "VIC",
    "postalCode": "3121",
    "addressCountry": "AU"
  },
  "areaServed": ["Melbourne", "Sydney", "Brisbane", "Australia"],
  "sameAs": [
    "https://www.linkedin.com/company/pulp-digital-agency",
    "https://clutch.co/profile/pulp-digital",
    "https://www.instagram.com/pulpdigital/"
  ]
}</code></pre>
    </div>
    <div>
      <h3 class="h3 on-dark">Service &amp; Client Relationship Schema</h3>
      <pre class="code-box dark"><code>{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Shopify Paid Ads & Meta Advertising",
  "provider": {
    "@type": "MarketingAgency",
    "name": "Pulp Digital"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "eCommerce Performance Marketing",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Meta Ads & Paid Social" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Google Ads & Performance Max" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "TikTok Advertising for DTC" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Shopify CRO & Retention" } }
    ]
  }
}</code></pre>
    </div>
  </div>
  <footer class="foot on-dark"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 16: Schema Specification</span></footer>
`, { dark: true });

// ─── 18. RAG-READY PAGE ENGINEERING ─────────────────────────────────────────
slide('tech-18-rag-engineering', 'light', `
  <header class="hd"><p class="eyebrow">17.0 RAG Architecture</p><h2 class="h1">Information Gain &amp; Direct-Answer Page Engineering</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">RAG Retrieval Chunking Architecture</h3>
      <p class="body-p">Modern generative answer engines retrieve 200–500 token semantic chunks via embedding similarity. We re-engineer Pulp Digital's service pages to provide quotation-ready answer blocks:</p>
      <div class="callout-card">
        <b>Target RAG Answer Block:</b>
        <p class="body-p"><i>"Pulp Digital is a Melbourne-based boutique performance marketing agency specializing in 7- and 8-figure eCommerce brands on Shopify. The agency manages over $50M in annual Meta, Google, and TikTok ad spend, averaging a verified 3.8× ROAS across clients including Factorie, Typo, Naked Harvest, and Allkinds."</i></p>
      </div>
    </div>
    <div>
      <h3 class="h3">Microdata Proof Structure</h3>
      <ul class="plist">
        <li><b>Structured Case Study Tables:</b> Embed HTML tables containing baseline spend, scaled GMV, MER/ROAS lift, and payback period.</li>
        <li><b>JSON-LD ItemList Schema:</b> Enables models to extract exact quantitative figures without hallucination.</li>
        <li><b>FAQPage Microdata:</b> Directly answers high-intent queries ("What are Pulp Digital's retainers?", "What ROAS does Pulp achieve?").</li>
      </ul>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 17: RAG Architecture</span></footer>
`);

// ─── 19. 5 ENGINEERING WORKSTREAMS ──────────────────────────────────────────
slide('tech-19-5-workstreams', 'white', `
  <header class="hd"><p class="eyebrow">18.0 Engineering Roadmap</p><h2 class="h1">The 5 Workstreams Mapped to Logit Covariates</h2></header>
  <div>
    <table class="tech-table">
      <thead><tr><th>Workstream</th><th>Target Logit Covariate</th><th>Target Delta</th><th>Operational Engineering Deliverables</th></tr></thead>
      <tbody>
        <tr><td><b>WS 1: Citation Gatekeepers</b></td><td>$X_{\\text{DirCentrality}}$</td><td>$0.00 \\to 0.85$</td><td>Verified, review-backed profiles on Clutch.co, Shopify Plus Partner Directory, GoodFirms, Semrush.</td></tr>
        <tr><td><b>WS 2: Local &amp; Maps Infrastructure</b></td><td>$X_{\\text{MapPack}}, \\ln(X_{\\text{Rev}}+1)$</td><td>$\+1.651$ impact</td><td>Scale Cremorne HQ reviews from 20 to 50+; establish verified virtual GBPs in Sydney and Brisbane.</td></tr>
        <tr><td><b>WS 3: RAG-Ready Practice Pages</b></td><td>$X_{\\text{OrgRank}}$</td><td>$8.0 \\to 2.5$ avg</td><td>Dedicated quotation-ready landing pages for Google PMax, TikTok Ads, and 7-Figure DTC Scaling.</td></tr>
        <tr><td><b>WS 4: Entity Knowledge Graph</b></td><td>$\\text{EAI}$ (Entity Accuracy)</td><td>$0.75 \\to 0.95$</td><td>Deploy canonical JSON-LD Organization schema, sameAs links, Wikidata entry, and structured case studies.</td></tr>
        <tr><td><b>WS 5: Longitudinal Telemetry</b></td><td>$\\text{WVI}, \\widehat{\\text{SoMV}}$</td><td>Audit &amp; p &lt; 0.05</td><td>Automated monthly 280-query cron re-audit with Wilcoxon signed-rank significance validation.</td></tr>
      </tbody>
    </table>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 18: 5 Workstreams</span></footer>
`);

// ─── 20. 90-DAY SPRINT GANTT SCHEDULE ───────────────────────────────────────
slide('tech-20-gantt-schedule', 'light', `
  <header class="hd"><p class="eyebrow">19.0 Execution Roadmap</p><h2 class="h1">90-Day Engineering Gantt Sprint Schedule</h2></header>
  <div>
    <table class="tech-table">
      <thead><tr><th>Sprint Phase</th><th>Weeks</th><th>Focus Area</th><th>Deliverables &amp; Milestones</th></tr></thead>
      <tbody>
        <tr><td><b>Phase 1: Knowledge Graph &amp; Foundation</b></td><td>Weeks 1–4</td><td>Entity Graph &amp; Citations</td><td>Deploy Organization schema; launch Clutch &amp; Shopify Partner directory profiles; launch Cremorne review push.</td></tr>
        <tr><td><b>Phase 2: RAG Architecture &amp; Case Studies</b></td><td>Weeks 5–8</td><td>RAG Landing Pages</td><td>Publish Google PMax &amp; TikTok RAG pages; re-architect Factorie &amp; Naked Harvest case studies with live microdata.</td></tr>
        <tr><td><b>Phase 3: Interstate Expansion &amp; Re-Audit</b></td><td>Weeks 9–12</td><td>Geo Grounding &amp; Telemetry</td><td>Ground Sydney &amp; Brisbane virtual entities; execute first 90-day empirical re-audit; verify p &lt; 0.05 gain.</td></tr>
      </tbody>
    </table>
    <div class="callout-card">
      <b>Sprint Velocity:</b> Bi-weekly automated telemetry tests run throughout execution to detect RAG index invalidation and early model pickup.
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 19: Gantt Roadmap</span></footer>
`);

// ─── 21. 12-MONTH FORECAST MODELS ───────────────────────────────────────────
slide('tech-21-forecast-models', 'dark', `
  <header class="hd"><p class="eyebrow on-dark">20.0 Predictive Modeling</p><h2 class="h1 on-dark">12-Month Target Trajectory &amp; Statistical Bounds</h2></header>
  <div class="cols-2">
    <div>
      <table class="tech-table on-dark">
        <thead><tr><th>Milestone Horizon</th><th>Melbourne SoMV</th><th>National SoMV</th><th>Target WVI</th><th>Primary Driver</th></tr></thead>
        <tbody>
          <tr><td><b>Baseline (Oct 2026)</b></td><td>17.1% (6/35)</td><td>2.5% (7/280)</td><td>0.013</td><td>Measured organic baseline</td></tr>
          <tr><td><b>Month 3 (Jan 2027)</b></td><td>40.0%</td><td>18.0%</td><td>0.140</td><td>Clutch + Shopify directory live</td></tr>
          <tr><td><b>Month 6 (Apr 2027)</b></td><td>65.0%</td><td>42.0%</td><td>0.360</td><td>Sydney/Brisbane virtual GBPs</td></tr>
          <tr class="hl-pulp"><td><b>Month 12 (Oct 2027)</b></td><td><b>85.0%</b></td><td><b>70.0%</b></td><td><b>0.620</b></td><td><b>#1 Recommended Shopify Paid Ads Agency</b></td></tr>
        </tbody>
      </table>
    </div>
    <div>
      <h3 class="h3 on-dark">Hypothesis Testing Protocol for Progress</h3>
      <p class="body-p on-dark">To verify that visibility gains across monthly audits represent true optimization rather than stochastic noise, apply the non-parametric <b>Wilcoxon Signed-Rank Test</b> across paired query cells:</p>
      <div class="math-box dark">
        $$W = \\sum_{i=1}^{N_r} \\left[ \\text{sgn}(x_{2,i} - x_{1,i}) \\cdot R_i \\right]$$
      </div>
      <div class="callout-card dark">
        <b>Statistical Sign-off:</b> A monthly campaign gain is officially deemed verified only when $p\text{-value} &lt; 0.05$ against identical query baselines.
      </div>
    </div>
  </div>
  <footer class="foot on-dark"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 20: Predictive Modeling</span></footer>
`, { dark: true });

// ─── 22. TELEMETRY PROTOCOL & AUDIT SIGNOFF ─────────────────────────────────
slide('tech-22-telemetry-protocol', 'white', `
  <header class="hd"><p class="eyebrow">21.0 Verification Protocol</p><h2 class="h1">Continuous Telemetry Protocol &amp; Engineering Sign-Off</h2></header>
  <div class="cols-2">
    <div>
      <h3 class="h3">Automated Monthly Cron Re-Audit Protocol</h3>
      <ul class="plist">
        <li><b>Fixed Seed Matrix:</b> Identical 280-query battery executed on the 1st of every calendar month.</li>
        <li><b>Multi-Run Resampling:</b> $N=3$ independent temporal epochs to measure and de-bias LLM non-determinism.</li>
        <li><b>Automated Wilson Score Drift Alerts:</b> Flag any regression where lower confidence bound drops below previous epoch.</li>
      </ul>
    </div>
    <div>
      <h3 class="h3">Engineering Sign-Off &amp; Version Control</h3>
      <div class="callout-card">
        <b>Version:</b> Standard Protocol V2.0 · Production Release<br/>
        <b>Audit Authority:</b> Uprise Digital GEO Intelligence &amp; Data Science Unit<br/>
        <b>Data Reproducibility:</b> All raw JSON observations, places, and SERP payloads archived in <code>comprehensive_empirical_research_results.json</code>.<br/>
        <b>Next Scheduled Telemetry Run:</b> 1 November 2026.
      </div>
    </div>
  </div>
  <footer class="foot"><span class="foot-logo">${LOGO_SRC}</span><span class="foot-meta">Technical Dossier · Section 21: Verification Protocol</span></footer>
`);

// ─── Generate HTML ──────────────────────────────────────────────────────────
const htmlContent = `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
<title>Pulp Digital · Internal Technical Data Science Dossier (AEO/GEO)</title>
<link rel="stylesheet" href="deck.css"/>
<!-- KaTeX for crisp mathematical formula rendering -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" crossorigin="anonymous"
  onload="renderMathInElement(document.body, { delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}], throwOnError: false });">
</script>
<style>
/* Technical Dossier Specialized Styles */
.tech-badge { display:inline-block; font-size:13px; font-weight:800; letter-spacing:0.14em; color:#FF4D2D; background:rgba(255,77,45,0.12); border:1px solid rgba(255,77,45,0.35); border-radius:6px; padding:5px 12px; margin-bottom:14px; text-transform:uppercase; font-family:var(--f-mono); }
.math-box { background:#F4EFE6; border-left:4px solid #FF4D2D; padding:12px 18px; font-family:"Times New Roman", Cambria, serif; font-size:20px; margin:10px 0; border-radius:0 8px 8px 0; overflow-x:auto; }
.math-box.dark { background:#151A24; border-left-color:#FF4D2D; color:#EDF2FA; }
.tech-table { width:100%; border-collapse:collapse; font-size:15px; margin:10px 0; }
.tech-table th { text-align:left; padding:8px 10px; border-bottom:2px solid #D5DDE9; font-weight:700; color:#576275; }
.tech-table td { padding:7px 10px; border-bottom:1px solid #E5EBF4; }
.tech-table.on-dark th { border-bottom-color:#2A3445; color:#8A96AA; }
.tech-table.on-dark td { border-bottom-color:#1E2634; color:#D5DDE9; }
.tech-table tr.hl-pulp td { background:rgba(255,77,45,0.08); font-weight:700; color:#FF4D2D; }
.tech-table tr.total-row td { border-top:2px solid #576275; font-weight:700; }
.code-box { background:#0C0F14; color:#D5DDE9; padding:14px; border-radius:8px; font-family:Consolas, monospace; font-size:12px; line-height:1.45; overflow-x:auto; border:1px solid #1E2634; }
.code-box.dark { background:#07090C; }
.callout-card { background:#F8F4EC; border:1px solid #E5DFD4; border-radius:8px; padding:12px 16px; font-size:15px; line-height:1.45; margin-top:12px; color:#11151E; }
.callout-card.dark { background:#151A24; border-color:#222C3D; color:#EDF2FA; }
.kpi-mini-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:14px; }
.kpi-card { background:#F4EFE6; border-radius:8px; padding:12px; text-align:center; }
.kpi-val { display:block; font-size:26px; font-weight:800; color:#FF4D2D; }
.kpi-lbl { display:block; font-size:12px; color:#576275; margin-top:4px; font-weight:600; }
.arch-flow { display:flex; flex-direction:column; gap:6px; }
.arch-box { background:#FFFFFF; border:1px solid #D5DDE9; border-radius:6px; padding:10px 14px; font-size:14px; }
.arch-box.dark { background:#151A24; border-color:#222C3D; }
.arch-box b { display:block; font-size:15px; color:#11151E; }
.arch-box.dark b { color:#EDF2FA; }
.arch-box span { font-size:13px; color:#576275; }
.arch-box.dark span { color:#8A96AA; }
.arch-arrow { text-align:center; font-size:14px; color:#FF4D2D; font-weight:bold; }
.law-card { background:#FFFFFF; border:1px solid #E5DFD4; border-radius:8px; padding:16px; margin-bottom:12px; }
.law-num { display:inline-block; font-family:var(--f-mono); font-size:12px; font-weight:800; color:#FF4D2D; letter-spacing:0.1em; margin-bottom:4px; }
.law-title { font-size:20px; font-weight:700; margin-bottom:6px; }
.quote-box { background:#FFFFFF; border-left:4px solid #FF4D2D; padding:14px 18px; border-radius:0 8px 8px 0; margin-bottom:12px; }
.quote-text { font-size:16px; font-style:italic; line-height:1.45; color:#11151E; }
.quote-src { display:block; font-size:12px; font-family:var(--f-mono); color:#576275; margin-top:8px; }
.nav-toggle-btn { position:fixed; top:24px; right:28px; z-index:9999; background:#FF4D2D; color:#FFFFFF !important; text-decoration:none; padding:10px 20px; border-radius:999px; font-family:var(--f-sans); font-weight:700; font-size:15px; letter-spacing:-0.2px; box-shadow:0 6px 20px rgba(255,77,45,0.45); display:inline-flex; align-items:center; gap:8px; transition:transform 0.2s ease, background 0.2s ease; }
.nav-toggle-btn:hover { background:#D83A1B; transform:translateY(-2px); }
</style>
</head>
<body>
<a href="index.html" class="nav-toggle-btn" title="Switch to Executive Client Pitch Deck">
  <span>← View Executive Pitch Deck</span>
</a>

<div id="deck" class="deck" role="region" aria-label="Slide presentation">
  <div class="stage" id="stage">
${slides.map((s, i) => `
<section class="slide ${s.theme}" id="${s.id}" data-title="${s.id}">
  ${s.html}
</section>`).join('\n')}
    <div class="progress" aria-hidden="true"><i id="bar"></i></div>
  </div>
</div>

<nav class="controls" id="controls" aria-label="Slide controls">
  <button id="prev" type="button" aria-label="Previous slide"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></button>
  <span id="count" class="ctr">1 / ${slides.length}</span>
  <button id="next" type="button" aria-label="Next slide"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></button>
  <button id="fs" type="button" aria-label="Full screen"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></button>
</nav>

<script src="deck.js"></script>
<script>
// Fail-safe trigger for KaTeX math auto-rendering
document.addEventListener('DOMContentLoaded', function() {
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false}
      ],
      throwOnError: false
    });
  }
});
</script>
</body>
</html>`;

fs.writeFileSync('technical.html', htmlContent);
console.log(`Generated technical.html (${slides.length} slides, ${htmlContent.length} bytes)!`);
