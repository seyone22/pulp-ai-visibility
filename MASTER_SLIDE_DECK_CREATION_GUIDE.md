# Master Slide Deck Creation Guide: AI Visibility & GEO Reports
**Production Manual, Design Engineering System & Bespoke Brand Templating Protocol**  
*Version 1.0 · Agency Standards for Interactive Client Pitch & Benchmark Presentations*

---

## 1. System Vision & Architecture

This guide defines the complete engineering and design standard for building bespoke, interactive, animated slide deck reports—modeled on the benchmark **LHD AI Visibility Report**. 

When building a report for any new client, the deck must never feel like an off-the-shelf template. It must be **hyper-personalized**, **strictly on-brand**, **data-dense**, and **cinematic in its execution**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DECK GENERATION WORKFLOW                        │
├───────────────────┬─────────────────────┬──────────────────────────────┤
│ 1. BRAND DISCOVERY│ 2. DATA SYNTHESIS   │ 3. CODE GENERATION           │
│ • Logo SVG grab   │ • Run AEO/GEO panel │ • Inject design tokens (CSS) │
│ • Palette extract │ • Compute WVI & SoMV│ • Build bespoke SVG charts   │
│ • Typography pair │ • Map hallucinations│ • Compile single-file HTML5  │
└───────────────────┴─────────────────────┴──────────────────────────────┘
```

---

## 2. Phase 1: Brand Investigation & Design Tokenization

Before writing a single line of presentation code, conduct a forensic investigation of the target company's digital brand identity.

### 2.1 Automated Brand Asset Harvesting Checklist

1. **Logo Extraction (Vector-First):**
   - Inspect the client's live website header or press kit.
   - Extract the pure inline `<svg>` code for the logo.
   - Extract both **Light Mode** (dark text/icon) and **Dark Mode** (white text/icon) variations.
   - If the SVG uses clipping masks (like `mask="url(#lhdmask1)"`), ensure unique mask IDs to prevent collisions across slides.
2. **Color Palette Forensic Extraction:**
   - **Primary Brand Color (`--brand-primary`):** The dominant brand identity color (e.g., LHD Royal Blue `#2251FF`).
   - **Primary Tint Scale:** Generate 5 tints for heatmaps and charts:
     - 100% saturation: `#2251FF` (Score 5/5)
     - 75% saturation: `#4D71FF` (Score 4/5)
     - 50% saturation: `#7C97FF` (Score 3/5)
     - 25% saturation: `#AFC0FF` (Score 2/5)
     - 10% saturation: `#DCE4FF` (Score 1/5)
     - 0% / Blank: `#FFFFFF` (Score 0/5, dashed border)
   - **Dark Mode Background (`--bg-dark`):** Never pure `#000000`. Use deep chromatic slate or brand-tinted black (e.g., `#111A2E` or `#0D1117`).
   - **Light Mode Surface (`--bg-light`):** Off-white, soft paper tone (e.g., `#F3F5F9` or `#F8FAFC`).
   - **Typography Neutral (`--ink`):** High-contrast deep slate/charcoal (e.g., `#111A2E` or `#1E293B`).
   - **Border & Line (`--line`):** Subdued divider color (e.g., `#E2E8F0`).
3. **Typography Pairing:**
   - Primary: Sans-serif modern neutral (`Inter`, `Plus Jakarta Sans`, `Cabinet Grotesk`, or brand-specific web font).
   - Display Headings: High-weight, tight tracking (`letter-spacing: -0.02em`, `font-weight: 700`).
   - Body & Numerics: Tabular figures enabled (`font-variant-numeric: tabular-nums`) for clean financial and percentage alignment.

### 2.2 Standard CSS Design Token Architecture

Inject these tokens into the root `<style>` block of the presentation:

```css
:root {
  /* Brand Specific Identity */
  --brand: #2251FF;              /* Client Primary Accent */
  --brand-hover: #183ED4;
  --brand-50: #EEF2FF;
  --brand-100: #DCE4FF;
  --brand-200: #AFC0FF;
  --brand-300: #7C97FF;
  --brand-400: #4D71FF;

  /* Surfaces & Canvas */
  --canvas-light: #F3F5F9;
  --canvas-white: #FFFFFF;
  --canvas-dark: #111A2E;
  --panel-bg: #FFFFFF;
  --line: #E2E8F0;
  
  /* Text & Inks */
  --ink: #111A2E;
  --slate: #4A5568;
  --muted: #94A3B8;
  --on-dark: #F8FAFC;
  --on-dark-muted: #94A3B8;

  /* Competitor Benchmark Color */
  --competitor-lead: #1F2A44;    /* Neutral dark gray for leading rival */
  
  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --k: 1; /* Responsive scale factor computed dynamically via JS */
}
```

---

## 3. Presentation Engine & Technical Specifications

The presentation deck must be delivered as a **self-contained, zero-dependency HTML5 application** (single-file HTML containing all inline CSS, inline SVGs, and Vanilla JS).

### 3.1 Fixed Canvas Scaling (1920x1080 CSS Engine)
To guarantee pixel-perfect layout preservation across laptops, 4K monitors, projectors, and mobile displays, all coordinate spaces are built at a native `1920x1080` resolution and scaled dynamically:

```css
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000000;
  font-family: var(--font-sans);
}

.deck {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.stage {
  width: 1920px;
  height: 1080px;
  position: absolute;
  transform-origin: center center;
  transform: scale(var(--k));
  overflow: hidden;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  padding: 72px 88px;
  box-sizing: border-box;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateX(40px);
}

.slide.is-active {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(0);
  z-index: 10;
}

.slide.is-past {
  transform: translateX(-40px);
  opacity: 0;
}
```

### 3.2 Responsive Auto-Fitter (Vanilla JavaScript)

```javascript
(function () {
  const stage = document.getElementById('stage');
  function fit() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scale = Math.min(w / 1920, h / 1080);
    stage.style.setProperty('--k', scale);
  }
  window.addEventListener('resize', fit);
  fit();
})();
```

### 3.3 Navigation & Presenter Controls
- **Presenter Keyboard Shortcuts:**
  - `ArrowRight`, `ArrowDown`, `PageDown`, `Space`, `Enter` $\rightarrow$ Advance slide.
  - `ArrowLeft`, `ArrowUp`, `PageUp`, `Backspace` $\rightarrow$ Previous slide.
  - `Home` / `End` $\rightarrow$ Jump to First / Last slide.
  - `f` / `F` $\rightarrow$ Toggle Fullscreen API.
- **Smart Clicker Zones:**
  - Left $1/3$ of the screen $\rightarrow$ Go back.
  - Right $2/3$ of the screen $\rightarrow$ Advance forward.
- **Presenter Mode Auto-Hide:**
  - Progress bar and slide counter automatically fade to `opacity: 0` after 2.6 seconds of cursor inactivity, and restore on mouse move.
- **URL Hash Synchronization:**
  - Slide changes push `#s1`, `#s2`, `#s3` to browser history without triggering page reload (`history.replaceState`).

---

## 4. Animation & Motion Design System

Animations must communicate **data truth**, not gratuitous decoration. Every animation must be tied to the `.is-active` class so transitions trigger precisely when a slide is entered.

### 4.1 Keyframe Library

```css
/* 1. Staged Element Rise */
@keyframes rise {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 2. Horizontal Bar Grow */
@keyframes growBar {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

/* 3. SVG Path Line Draw */
@keyframes pathDraw {
  to { stroke-dashoffset: 0; }
}

/* 4. Client Highlight Spotlight Pulse */
@keyframes spotlightHalo {
  0% { box-shadow: 0 0 0 0 rgba(34, 81, 255, 0); }
  40% { box-shadow: 0 0 0 12px rgba(34, 81, 255, 0.25); }
  100% { box-shadow: 0 0 0 0 rgba(34, 81, 255, 0); }
}

/* 5. Ambient Background Drift on Dark Slides */
@keyframes ambientDrift {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-60px, 30px) scale(1.08); }
  100% { transform: translate(0, 0) scale(1); }
}
```

### 4.2 High-Impact Interactive Counter Engine
For big metrics (e.g., `99 of 280 answers`, `+85%`), the numbers must animate up from zero upon slide entry:

```javascript
function countUp(root) {
  root.querySelectorAll('[data-counted]').forEach(function (el) {
    const target = parseFloat(el.getAttribute('data-to'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    const start = performance.now();
    
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4); // quartic ease-out
      const current = Math.round(target * easeOut);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    }
    requestAnimationFrame(update);
  });
}
```

---

## 5. Visual Component Design Catalog

### 5.1 The Cover Slide Dot Matrix (280 Observations)
Visualizes every analyzed AI query response simultaneously to showcase study volume:
```html
<figure class="cover-grid" aria-label="Grid of 280 AI answers by city">
  <figcaption>
    <span class="key on"></span> Answer names Client 
    <span class="key off"></span> Answer leaves Client out
  </figcaption>
  <div class="cv-row">
    <span class="cv-city">Sydney</span>
    <span class="cv-cells">
      <i class="on" style="--d:0ms"></i>
      <i class="off" style="--d:10ms"></i>
      <i class="on" style="--d:20ms"></i>
      <!-- Repeat for 35 queries per city -->
    </span>
    <span class="cv-n">9 / 35</span>
  </div>
</figure>
```

### 5.2 The 3-Column City Breakdown Slide
The workhorse slide layout for individual city markets (e.g., Sydney, Melbourne, Brisbane):
```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│ COLUMN 1 (45% Width)    │ COLUMN 2 (25% Width)    │ COLUMN 3 (30% Width)    │
│ Head-to-Head Bars       │ City KPI Scorecard      │ Qualitative Takeaways   │
│ • Rank #1: Rival (27)   │ • Market Share: 26%     │ • Doyle's Guide leader  │
│ • Rank #2: Rival (22)   │ • City Rank: #9         │ • 0/5 Medical Negligence│
│ • Rank #9: Client (9)   │ • Dot-strip by practice │ • Google Maps review gap│
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

### 5.3 The Practice Area Zero-Mention Heatmap
Highlights complete market blind spots across categories:
```html
<div class="heatmap-grid">
  <!-- Color saturation tied to scores 0 to 5 -->
  <div class="hm-cell score-5" style="background: var(--brand); color: #fff;">5</div>
  <div class="hm-cell score-3" style="background: var(--brand-300); color: #fff;">3</div>
  <div class="hm-cell score-1" style="background: var(--brand-100); color: var(--ink);">1</div>
  <div class="hm-cell score-0 zero" style="background: #fff; border: 2px dashed #CBD5E1;">0</div>
</div>
```

### 5.4 The 12-Week Execution Gantt Chart
Visualizes the strategic workstream delivery over Months 1, 2, and 3:
- **Lane 1:** Rankings & Directories (Doyle's, Best Lawyers submissions).
- **Lane 2:** Google Maps & Reviews (Fixing suspended/low-review profiles).
- **Lane 3:** RAG Practice Landing Pages (Building structured question-and-answer pages).
- **Lane 4:** Entity Knowledge Graph & Schema (`sameAs` links, disambiguation, fixing M&A facts).
- **Lane 5:** Continuous Measurement & Re-Audits (Week 1 baseline $\rightarrow$ Weeks 4, 8, 12 re-runs).

---

## 6. Pre-Flight Delivery Checklist

Before sending the compiled presentation deliverable to the client:

- [ ] **Brand Color Validation:** Primary accent matches the client's official hex value exactly.
- [ ] **Vector Integrity:** Inline logo SVG renders cleanly on both `#cover` (dark) and light slide headers without pixelation.
- [ ] **Clipping Mask Safety:** All `<mask id="...">` attributes within SVGs have unique prefixed identifiers to prevent graphic glitches across slides.
- [ ] **Zero Broken Assets:** No external images, webfonts, or script dependencies that require external network requests; everything is self-contained.
- [ ] **Cross-Device Fit:** Stage scaling (`--k`) tested on 13" laptop (1280x800), 27" monitor (2560x1440), and mobile landscape viewport.
- [ ] **Counter Synchronization:** Every `.count` element has matching `data-to="..."` attributes and accurate tabular figures.
- [ ] **Presenter Navigation:** Arrow keys, click progression, swipe gestures, and fullscreen toggle operate without console errors.

---

## 7. Dual-Deck Architecture: Executive Pitch (Tier 1) vs. Technical Dossier (Tier 2)

Production engagements require a two-tiered presentation architecture to serve distinct client and internal stakeholders:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      TWO-TIER DECK ARCHITECTURE                        │
├──────────────────────────────────┬─────────────────────────────────────┤
│ TIER 1: Executive Pitch Deck     │ TIER 2: Technical Dossier           │
│ URL: / or index.html             │ URL: /technical or technical.html   │
│ Audience: C-Suite, CMO, Partners │ Audience: Head of Data, CTO, Eng    │
│ Focus: Commercial Loss, ROI, Plan│ Focus: Econometrics, Logit, DDL     │
│ Slides: 30 visual narrative      │ Slides: 22 rigorous mathematical   │
│ Math: Minimal (High-level KPIs)  │ Math: KaTeX rendered formulas       │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### 7.1 Cross-Deck Navigation Bridge
Every presentation must include a persistent navigation pill in the top-right header:
- Executive Deck includes: `<a href="technical.html" class="nav-toggle-btn"><span>View Technical Dossier →</span></a>`
- Technical Deck includes: `<a href="index.html" class="nav-toggle-btn"><span>← Return to Executive Deck</span></a>`

---

## 8. Telemetry Transparency & Formula Standards

### 8.1 KaTeX Mathematical Engine Integration
Never output raw LaTeX syntax (e.g. `\text{SoMV}`) as plain text. Every technical deck must load KaTeX with auto-render:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" crossorigin="anonymous"
  onload="renderMathInElement(document.body, { delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}], throwOnError: false });">
</script>
```

### 8.2 Mandatory Telemetry Mode Disclosure
Presentations must strictly disclose data collection mechanisms:
1. **Direct Live API Grounding (`[LIVE_API]`):** Fired live against vendor API endpoints (e.g. Google Gemini 3.8 Grounded, Serper Google Local & Organic SERP). Badged in green.
2. **Empirical Proxy Modeling (`[EMPIRICAL_PROXY]`):** Statistical retrieval modeling for third-party platforms without direct paid API access (e.g. ChatGPT Search, Claude Sonnet, Perplexity Sonar). Badged in amber.
3. **Disclosure Callouts:** Methodology slides must explicitly explain proxy conditionality (e.g. mapping live SERP rankings, Local Map Packs, and verified directory citations to recommendation likelihood).

---

## 9. The Ned Presentation Standard: Strategic Restraint for Agency Prospects

When presenting to commercial prospects—especially marketing, advertising, or agency prospects who have internal teams—the presentation deck must adhere to **Ned's Standard of Strategic Restraint**:

```
┌────────────────────────────────────────────────────────────────────────┐
│             STRATEGIC RESTRAINT VS. INTERNAL SPECIFICITY               │
├──────────────────────────────────┬─────────────────────────────────────┤
│ TIER 1 PROSPECT PRESENTATION     │ TIER 2 INTERNAL TECHNICAL DOSSIER   │
│ • Less specific, consultative    │ • Hyper-specific, reproducible      │
│ • High-level commercial gaps     │ • Deep RAG retrieval mechanics      │
│ • "What we will do" action items │ • Exact schema, DDL & vector models │
│ • Mirrors Ned's LHD report style │ • Complete mathematical proofs      │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### 9.1 Non-Negotiable Presentation Invariants
1. **Never Give Away the Execution Blueprint:**  
   Avoid hyper-granular "how-to" tutorials on pitch slides. Agency prospects will attempt to self-execute or shop the strategy around if the deck provides an overly specific recipe.
2. **Slide 23 (Workstream 01) Formulation:**  
   - Header must mirror Ned's clean phrasing: `Workstream 01 · AI copies its shortlist from rankings guides and directories`.
   - Never turn Slide 23 into an academic thesis on RAG or explain the inner vector clustering algorithms to the prospect.
   - Action list must be framed simply as `What we will do` with strategic, commercial bullet points.
3. **Shift Deep Explanations to Internal Documentation:**  
   The comprehensive explanation of **how and where AI constructs shortlists** (vector embeddings, Dirichlet priors, citation gatekeepers, and logit causality) belongs strictly in the **Tier 2 Technical Dossier (`technical.html`)** and internal data science specifications.
4. **Clean Presentation Copy:**  
   Keep Slides 1–30 focused on the client's commercial reality: *Who AI names today, why competitors are winning calls, what the gap costs them, and the high-level roadmap to become #1.*


