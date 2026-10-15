# Tier 1 Client-Facing Report Specification & Template
**Executive Presentation & Strategic Pitch Deliverable (AEO / SEO / GEO)**  
*Document Level: Client-Facing (Managing Partners, CMOs, Business Owners)*  
*Format: 30-Slide Interactive Web Presentation / Executive Pitch Deck*

---

## 1. Objective & Deliverable Persona

### 1.1 The Audience
- **Target Audience:** Law firm partners, Managing Directors, Chief Marketing Officers, and business stakeholders.
- **Cognitive Profile:** Commercially astute, results-driven, time-constrained, non-technical. They do not care about API endpoints, p-values, or web scraping architecture; they care about **lost market share**, **brand authority**, **client acquisition**, and **actionable ROI**.
- **Tone & Aesthetic:** Authoritative, clean, consultative, visually restrained (editorial typography, high-contrast monochrome with single vivid accent blue, SVG data visualizations).

### 1.2 The Narrative Arc
The client-facing deck follows a strict 6-stage commercial narrative:
```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. THE DISRUPTION     "Australians are asking AI, not Google links"    │
│ 2. THE SCORECARD      "Here is where you stand nationally"             │
│ 3. THE CITY BREAKDOWN "Your local strongholds vs. invisible markets"   │
│ 4. THE ROOT CAUSES    "Why AI chooses your competitors over you"       │
│ 5. THE WORKSTREAMS    "The 5-part plan to fix every gap"               │
│ 6. THE ROADMAP & KPIS "The first 90 days and 12-month targets"         │
└────────────────────────────────────────────────────────────────────────┘
```

### 1.3 The Ned Reporting Standard: Strategic Restraint for Agency Prospects
When presenting to commercial prospects (particularly agency owners, marketing directors, and business executives), the presentation must strictly mirror **Ned's style**:
1. **Less Specific, High-Level Consultative:** Never give away the exact technical blueprint or turn slides into a granular execution recipe that prospects can try to self-execute.
2. **Shift Technical Minutiae to Internal Docs:** Granular explanations of *where and how AI constructs shortlists from* (vector embeddings, citation clustering, Dirichlet priors, and logit regression tables) must be shifted into the Tier 2 Internal Technical Dossier.
3. **Action Items Phrased as "What We Will Do":** On Slide 23 and subsequent workstream slides, keep actions framed as consultative agency deliverables (e.g. *"Establish and optimize verified agency profiles across the top directories cited in Australian eCommerce answers"*), avoiding proprietary algorithm jargon.

---

## 2. 30-Slide Architecture & Master Blueprint

The table below outlines the exact slide structure based on the standardized 30-slide format established in the benchmark study:

| Slide # | Slide ID | Theme | Section Title | Key Visual Component | Primary Takeaway Message |
|:---|:---|:---|:---|:---|:---|
| **01** | `#cover` | Dark | AI Visibility Report | Dynamic Grid (280 answers) | *"When prospective clients ask AI for [Service], who gets named?"* |
| **02** | `#why` | Light | Why This Matters Now | Area chart (+85% AI search) | AI gives a 5-firm shortlist, not 10 links; omitted firms lose calls. |
| **03** | `#method` | White | How We Measured It | Formula: $8 \times 7 \times 5 = 280$ | 280 evaluated answers across 8 cities, 7 questions, 5 assistants (Live Google Grounding + Proxy Modeling). |
| **04** | `#national` | Light | National Standings | Horizontal ranking bar chart | Overall national standing (#4) against legacy market leaders. |
| **05** | `#map` | Light | City by City Overview | Interactive regional map / dots | Sharp geographic variance: dominant in Hobart (#1), invisible in Brisbane (#46). |
| **06** | `#sydney-intro` | Dark | Market Focus: Sydney | Big KPI Callout (26% share) | Sydney is the highest-value battleground with the widest competitive gap. |
| **07** | `#sydney-board` | Light | Sydney Leaderboard | Horizontal bar chart | Direct gap: Competitor gets 27/35 answers, client gets 9/35. |
| **08** | `#sydney-heat` | Light | Model Engine Bias | Engine comparison heatmap | Each assistant has distinct favorites; client is missing from key engines. |
| **09** | `#sydney-practice`| White | Sydney Practice Matrix | Table of 7 practice areas | Zero-visibility blind spots (e.g., Medical Negligence 0/5). |
| **10** | `#sydney-why` | Light | Why Competitors Lead | Comparative attribute table | Competitors lead on Doyle's Guide rankings and Google Maps reviews. |
| **11–17**| `#city-2..8` | Light | City Profiles (2 to 8) | 3-column city scorecard | Individual diagnostic for Melbourne, Brisbane, Perth, Adelaide, etc. |
| **18** | `#pattern` | Light | The Underlying Pattern | Scatter / Map Pack correlation | Direct mathematical link: Google Maps visibility feeds AI generation. |
| **19** | `#trend` | Light | 14-Month AI Trend | Dual line trajectory graph | Competitor referenced $5\times$ more frequently in Google AI answers. |
| **20** | `#gap` | Light | The Opportunity Gap | Horizontal gap comparison bars | Client trails the market leader in 6 of 8 cities. |
| **21** | `#plan-intro` | Dark | The Strategic Plan | Section divider + thesis | Strategic pivot from diagnosis to execution. |
| **22** | `#plan` | Light | The 5 Workstreams | Summary matrix table | 5 distinct workstreams directly tied to diagnosed data gaps. |
| **23** | `#ws-sources` | Light | Workstream 01: Sources | Cited domain frequency chart | High-level directory strategy; detailed RAG citation mechanics shifted to internal dossier. |
| **24** | `#ws-maps` | Light | Workstream 02: Google Maps | Map pack frequency vs. reviews | Scaling local reviews and service categories across lagging offices. |
| **25** | `#ws-pages` | Light | Workstream 03: Practice Pages | Zero-mention heatmap (16 pairs)| Rebuilding landing pages with direct, quotation-ready answers. |
| **26** | `#ws-entity` | White | Workstream 04: Entity Accuracy| Verbatim quote callouts | Correcting hallucinated firm names, wrong settlement stats, and M&A. |
| **27** | `#roadmap` | Light | Execution Roadmap | 12-Week Phased Gantt Chart | Week-by-week delivery schedule across Months 1, 2, and 3. |
| **28** | `#targets` | Light | Proposed Targets | Target trajectory forecast chart| Projected growth: from 26% to 80% share in primary market. |
| **29** | `#close` | Dark | Next Steps & Agreement | Numbered action items | Sign-off on priorities, onboarding access, and 30-day re-measurement. |
| **30** | `#appendix` | White | Methodology & Definitions | Clean explanatory typography | Verification details, scoring rules, and DataForSEO methodology note. |

---

## 3. Slide Content Templates & Copy Guidelines

### Slide 01: The Cover (`#cover`)
- **Eyebrow:** `AI VISIBILITY REPORT · [MONTH YEAR]`
- **Headline (Display H1):** `When Australians ask AI for a [Service Category], who gets named?`
- **Sub-headline (Lede):** `[Client Name] against the competition in [X] cities, across [Y] AI assistants and [Z] real answers. We start with [Primary Market].`
- **Visual Element:** Dynamic dot matrix showing all $N$ answers color-coded: **Blue = Answer names client**, **Gray = Answer leaves client out**.

### Slide 02: Why This Matters Now (`#why`)
- **Key Metric Banner:** `+85% estimated monthly AI-assistant searches for “[Core Service]” in [Country], Oct 2025 to Sep 2026.`
- **3 Core Commercial Takeaways:**
  1. **AI gives a shortlist, not ten blue links.** The answers we collected named a median of 6 firms. A firm that isn't on the list doesn't get the phone call.
  2. **Each assistant builds its list from sources it trusts:** rankings guides, legal directories, Google Maps, and firm websites.
  3. **The shortlist changes by city.** You can lead in one state and be completely invisible in the next. Each market requires its own operational plan.

### Slide 07: Head-to-Head City Leaderboard (`#sydney-board`)
- **Headline:** `AI names [Client] in 9 of 35 [City] answers. [Competitor] gets 27.`
- **Visual Chart:** Ranked horizontal bars (0 to 35):
  - `1. Competitor A` — 27 / 35 (Leader highlight)
  - `2. Competitor B` — 24 / 35
  - `3. Competitor C` — 18 / 35
  - `...`
  - `9. [Client Name]` — 9 / 35 (Client highlight bar in vivid blue)

### Slide 18: The Pattern / Correlation (`#pattern`)
- **Headline:** `Where [Client] shows up on Google Maps, AI names [Client]`
- **The Narrative Proof:** 
  > *"Google AI Mode named [Competitor] in 6 of 7 Sydney answers. [Competitor] appears in 5 of 7 Sydney Google Map Packs. In cities where you have zero Map Pack presence, AI visibility drops to zero."*
- **Visual Chart:** Dot matrix mapping Map Pack presence (0 to 7) against AI mention rate.

### Slide 26: The Hallucination & Fact Audit (`#ws-entity`)
- **Headline:** `AI gets some facts about [Client] wrong`
- **Callout Format (3 Quote Cards):**
  - **Quote 1 (Name Invention):** Perplexity called the firm *"Lawyers, Doctors & Health (LDH)"* instead of *LHD Lawyers*.
  - **Quote 2 (Outdated Figures):** ChatGPT stated *"Over $220M recovered"*, while the homepage states *"$260 Million"*, because legacy office pages still contain old copy.
  - **Quote 3 (Unindexed M&A):** Claude recommended acquired subsidiary *Taylor & Scott* as an independent competing firm.
- **Action Takeaway:** Deploy centralized `Organization` schema with canonical `sameAs` references and synchronize across all corporate web properties.

### Slide 30: Methodology & Data Collection Disclosures (`#appendix`)
- **Headline:** `How the data was collected and verified`
- **Methodology Callout:**
  - **Dynamic Active-Engine Telemetry:** Evaluations are collected exclusively from live, authenticated AI answer engines ($N = M \times Q \times E$).
  - **Zero-Simulation Production Mandate:** Missing engines are never simulated, mocked, or hallucinated. The report dynamically adjusts its universe and denominators based on the active models evaluated.
  - **Keyed Platform Security:** Access to the presentation is secured via dedicated Client PIN (`CLIENT_PIN`). The Tier 2 Technical Dossier (`/technical`) is gated behind separate Internal PIN (`INTERNAL_PIN`) clearance.

---

## 4. UI/UX & Interactive Design System

To match the presentation standard of the web deliverable:

```css
/* Core Design Tokens */
:root {
  --bg: #F3F5F9;
  --surface: #FFFFFF;
  --ink: #111A2E;
  --slate: #4A5568;
  --blue: #2251FF;
  --blue-soft: #DCE4FF;
  --line: #E2E8F0;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### Presentation Controls:
- **Aspect Ratio:** Fixed 16:9 canvas (`1920x1080` CSS transform scaling with `--k` factor).
- **Navigation:** Arrow keys, click-advance (right 2/3 forward, left 1/3 back), touch swipe, and direct hash linking (`#s1`, `#s7`).
- **Presenter Mode:** Floating controls auto-hide after 2.6 seconds of inactivity.
- **Live Animations:** SVG path drawing (`stroke-dasharray`), number counter increments (`requestAnimationFrame` ease-out cubic), and spotlight halos on client rows.
