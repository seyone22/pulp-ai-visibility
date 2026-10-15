# Client Intake & Pre-Investigation Questionnaire: AEO / SEO / GEO Research
**Operational Intake Framework for Generative AI Visibility Audits**  
*Version 1.0 · Agency Onboarding & Scoping Protocol*

---

## Purpose of this Questionnaire

Before configuring an AI Visibility (AEO/SEO/GEO) investigation, this questionnaire collects the ground-truth data needed to:
1. **Calibrate the Query Matrix**: Ensure prompts reflect real customer language and commercial intent.
2. **Prevent Entity Disambiguation Errors**: Avoid false positives and false negatives during LLM mention extraction.
3. **Audit Fact-Checking & Hallucinations**: Benchmark AI claims against verified company records.
4. **Establish Competitor Baselines**: Select the true commercial rivals who are currently taking market share in AI answers.

---

## Quick Intake Overview (The "5-Minute Fast Track")

If time is limited, the following 6 core inputs are strictly required to start:

| # | Parameter | Client Input / Description |
|---|---|---|
| **1** | **Brand Name & Domains** | Official legal name, trading name, and website URLs. |
| **2** | **Target Markets (Cities)** | Exact cities/regions with verified physical presence or target reach. |
| **3** | **Core Practice / Service Lines** | 3–7 core high-margin services to test (e.g., Workers Comp, Medical Negligence). |
| **4** | **Top 3–5 Competitors** | Primary competitors you lose clients to or want to benchmark against. |
| **5** | **Google Business Profile (GBP) Status** | Number of verified office profiles and general review health. |
| **6** | **Key Commercial Proposition** | Core hook (e.g., *"No Win No Fee"*, *"24/7 Response"*, *"Fixed Price"*). |

---

## Section 1: Entity Identity & Brand Disambiguation

*LLMs often confuse similar brand names, acronyms, and recent rebrands. This section establishes the canonical entity baseline.*

### 1.1 Brand Identity & Aliases
- **Official Legal Name:** 
- **Brand / Trading Names:** (e.g., *"LHD Lawyers"*, *"LHD Law Firm"*)
- **Previous Names or Merged Entities:** (e.g., acquired firms like *"Taylor & Scott"*)
- **Common Acronyms & Shortforms:** (e.g., *"LHD"*)
- **Disambiguation / Conflict Hazards:** Are there other organizations with identical or similar names?  
  *(Example: "LHD" also stands for Local Health District in NSW; "Alliance" can refer to multiple civil contractors).*

### 1.2 Web & Digital Footprint
- **Primary Website URL:** 
- **Subsidiary / Landing Page URLs:** 
- **Key Social & Entity Profiles:** (LinkedIn Company Page, Crunchbase, Wikipedia, Wikidata, if applicable)

---

## Section 2: Market Footprint & Geographic Scope

*AI search engines use distinct local grounding (IP, GPS, Google Maps API). We need to know where you physically operate vs. where you service remotely.*

### 2.1 Geographic Hierarchy
- **Which cities or regions are in-scope for this audit?**  
  *(Rank in priority order, e.g., 1. Sydney, 2. Melbourne, 3. Brisbane, etc.)*
- **Physical Office vs. Serviced Locations:**
  - In which cities do you have a **staffed physical office**?
  - In which cities do you operate via **virtual offices, remote consultations, or fly-in service**?
  *(Note: LLMs and Google Maps heavily penalize virtual addresses or non-staffed PO boxes).*

### 2.2 Google Business Profiles (GBP)
- How many verified Google Business Profiles does the company currently hold?
- Are all office locations verified on Google Maps?
- Approximate review volume and rating for each core location:
  - *Location 1:* Reviews: _____ | Rating: _____
  - *Location 2:* Reviews: _____ | Rating: _____
  - *Location 3:* Reviews: _____ | Rating: _____

---

## Section 3: Core Services, Practice Areas & User Scenarios

*Generative engines respond to conversational user dilemmas, not just short keywords. We need your priority practice lines and real client scenarios.*

### 3.1 High-Priority Service Lines
List 5 to 7 specific services/practices you want audited, in order of business value:
1. *(e.g., Workers Compensation)*
2. *(e.g., Motor Vehicle Accident Claims)*
3. *(e.g., Medical Negligence)*
4. *(e.g., TPD & Superannuation Insurance Claims)*
5. *(e.g., Public Liability / Slip & Fall)*
6. 
7. 

### 3.2 Out-of-Scope Services
Are there any related services that you **do not** offer or want excluded from the test?  
*(Example: Criminal defense, family law, property conveyancing).*

### 3.3 Authentic Client Dilemmas & Scenarios
What are the top 3–5 real-world scenarios or questions clients describe when they contact you?
- *Scenario A (e.g., "I was injured at work and my employer is disputing the claim.")*
- *Scenario B (e.g., "I suffered surgical complications at a public hospital.")*
- *Scenario C (e.g., "I was denied my total permanent disability payout by my super fund.")*

### 3.4 Key Commercial Hooks & Pricing Models
What distinct commercial terms do clients search for regarding your services?
- [ ] *"No Win No Fee"* / Contingency
- [ ] Free Initial Consultation
- [ ] Fixed Fee / Upfront Pricing
- [ ] 24/7 Availability / Emergency Hotline
- [ ] Multi-lingual Support (Languages: ________________________)

---

## Section 4: Competitive Landscape & Benchmarks

*To measure Share of Voice (SoMV), we must define the benchmark universe.*

### 4.1 Primary Competitors
List 3 to 5 direct competitors who actively compete in your target cities:
1. Competitor A: ________________________ (Website: ________________________)
2. Competitor B: ________________________ (Website: ________________________)
3. Competitor C: ________________________ (Website: ________________________)
4. Competitor D: ________________________ (Website: ________________________)
5. Competitor E: ________________________ (Website: ________________________)

### 4.2 Competitive Dynamics
- Who is the **dominant market leader** in your industry? *(e.g., Slater & Gordon)*
- Who is an **aggressive digital competitor** outranking you locally? *(e.g., Law Partners)*
- Are there specific boutique or local firms that dominate individual cities?

---

## Section 5: Authority Sources, Citations & Accreditations

*AI models synthesize shortlists from third-party authority hubs. We need to identify your existing presence on these directories.*

### 5.1 Industry Directories & Accreditations
Check or list any industry-specific ranking guides, directories, or award bodies you participate in:
- [ ] Legal Directories: *Doyle's Guide*, *Best Lawyers*, *LawConnect*, *Law Society Directory*
- [ ] Consumer Directories: *ThreeBestRated*, *Word of Mouth*, *ProductReview.com.au*, *Yelp*, *YellowPages*
- [ ] Industry Accreditations: Specialist accreditations held by senior partners / key staff
- [ ] Media & Press: Notable news features, published whitepapers, or landmark cases

### 5.2 Citation URLs
Provide links to your company's most important third-party directory listings:
- Directory 1: ________________________________________________
- Directory 2: ________________________________________________
- Directory 3: ________________________________________________

---

## Section 6: Ground-Truth Data & Anti-Hallucination Audit

*AI engines frequently invent facts, misquote settlement figures, or confuse practice areas. This section provides the ground-truth facts to check against.*

| Attribute | Verified Fact / Company Record | Common AI Hallucination / Outdated Claim (if known) |
|---|---|---|
| **Years of Operation** | e.g., *Established in 1988 (38+ years)* | Often claims 20 or 30 years |
| **Total Settlements / Results** | e.g., *Over $260 Million recovered* | Outdated site copy says $220M |
| **Firm Specialties** | e.g., *Specializes exclusively in plaintiff compensation* | Hallucinates criminal law or general practice |
| **Locations / Offices** | e.g., *8 offices nationwide* | Inventing closed satellite branches |
| **Key Partners / Leadership** | e.g., *Managing Director: [Name]* | Hallucinating retired partners |
| **Mergers & Acquisitions** | e.g., *Acquired Taylor & Scott in 2024* | Treats acquired firm as a rival competitor |

---

## Section 7: Investigation Objectives & Deliverable Format

### 7.1 Primary Business Objective
What is the primary motivation for conducting this research?
- [ ] **Pre-Sales / Client Pitch Deck**: Demonstrating visibility gaps to secure an SEO/GEO engagement.
- [ ] **Baseline Benchmarking**: Establishing baseline metrics before kicking off a campaign.
- [ ] **Campaign Progress / Re-Audit**: Measuring month-over-month or quarterly visibility improvements.
- [ ] **Reputation & Hallucination Triage**: Finding and fixing incorrect AI responses about the brand.

### 7.2 Engine Scope
Which generative engines are highest priority for your customer base?
- [x] **ChatGPT (with Search)**
- [x] **Google AI Overviews / Google AI Mode**
- [x] **Perplexity (Sonar)**
- [x] **Gemini**
- [x] **Claude (Web Search)**
- [x] **Google Local 3-Pack & Organic SERP (Control Group)**

---

## Automated Client Intake Config (JSON Template)

*When answers are gathered, they can be formatted directly into this machine-readable JSON file to feed the automated collection pipeline:*

```json
{
  "client_intake": {
    "brand": {
      "legal_name": "LHD Lawyers Pty Ltd",
      "canonical_name": "LHD Lawyers",
      "known_aliases": ["LHD Law Firm", "LHD Personal Injury Lawyers"],
      "primary_domain": "lhd.com.au",
      "sub_brands": ["Taylor & Scott Lawyers"],
      "negative_entity_disambiguation": ["Local Health District", "LHD Health", "LHD Group"]
    },
    "markets": [
      { "city": "Sydney", "state": "NSW", "has_physical_office": true, "gbp_reviews": 421 },
      { "city": "Melbourne", "state": "VIC", "has_physical_office": true, "gbp_reviews": 170 },
      { "city": "Brisbane", "state": "QLD", "has_physical_office": false, "gbp_reviews": 0 },
      { "city": "Perth", "state": "WA", "has_physical_office": true, "gbp_reviews": 372 },
      { "city": "Adelaide", "state": "SA", "has_physical_office": false, "gbp_reviews": 0 },
      { "city": "Canberra", "state": "ACT", "has_physical_office": true, "gbp_reviews": 4 },
      { "city": "Newcastle", "state": "NSW", "has_physical_office": true, "gbp_reviews": 3 },
      { "city": "Hobart", "state": "TAS", "has_physical_office": true, "gbp_reviews": 127 }
    ],
    "core_practices": [
      "Personal Injury",
      "Workers Compensation",
      "Motor Vehicle Accidents",
      "No Win No Fee",
      "Medical Negligence",
      "TPD & Superannuation Claims",
      "Public Liability"
    ],
    "competitors": [
      { "name": "Slater and Gordon", "domain": "slatergordon.com.au" },
      { "name": "Maurice Blackburn", "domain": "mauriceblackburn.com.au" },
      { "name": "Turner Freeman", "domain": "turnerfreeman.com.au" },
      { "name": "Law Partners", "domain": "lawpartners.com.au" },
      { "name": "Shine Lawyers", "domain": "shine.com.au" }
    ],
    "verified_facts": {
      "settlement_total": "$260M+",
      "years_experience": "35+",
      "fee_structure": "No Win No Fee guaranteed"
    }
  }
}
```
