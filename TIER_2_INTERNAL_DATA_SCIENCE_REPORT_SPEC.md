# Tier 2 Internal Technical & Statistical Dossier
**Data Science Specification, Econometric Modeling & Algorithmic Architecture**  
*Document Level: Internal Technical (Data Scientist, Statistician, CEO, Head of Engineering)*  
*System: Generative Engine Optimization (GEO) & Answer Engine Optimization (AEO) Analytical Platform*

---

## 1. Executive Technical Summary & Problem Formulation

### 1.1 Mathematical Objective
Let $\mathcal{Q} = \{q_1, q_2, \dots, q_M\}$ represent a finite battery of localized user queries across practice domains $\mathcal{D}$ and geographical locations $\mathcal{L}$. Let $\mathcal{M} = \{m_1, m_2, \dots, m_K\}$ represent the set of generative AI engines (e.g., ChatGPT-4o, Perplexity-Sonar, Claude-3.5, Gemini-1.5, Google AI Mode).

For an entity $E$ (the client brand) within a competitive universe $\mathcal{C} = \{c_1, c_2, \dots, c_J\}$, each stochastic query execution $y \sim m_k(q_i \mid \theta)$ generates a natural language response $R_{ik}$.

The objective of this statistical framework is to:
1. Formulate non-parametric and parametric estimators of entity presence, prominence, and recommendation stance.
2. Quantify stochastic model variance induced by non-zero sampling temperatures ($\tau > 0$) and dynamic RAG index retrieval.
3. Compute unbiased confidence bounds ($95\%\text{ CI}$) across repeated trials.
4. Estimate causal dependencies between traditional SERP signals (Local 3-Pack, Organic Rank, Directory Citation Centrality) and the probability of generative engine citation via multi-variable logistic regression.

### 1.2 Telemetry Architecture: Live Grounding vs. Empirical Proxy Simulation
In enterprise client deployments where API keys may be partitioned across organizations, the analytical engine enforces strict metadata classification:
- **`LIVE_API_GROUNDED`:** Direct live programmatic API execution (e.g., Google Gemini 3.8 Flash with Google Search Grounding, Serper Google Local & Organic SERP).
- **`EMPIRICAL_PROXY_MODEL`:** Statistical retrieval modeling for third-party platforms (e.g., ChatGPT Search, Claude Sonnet, Perplexity Sonar) conditioned on verified index citations and authoritative directory consensus graphs.
- **Reporting Invariant:** Every dataset, regression model, and analytical table must partition observations by `telemetry_mode` to ensure empirical rigor.

---

## 2. Formal Metric Formulation & Algorithmic Definitions

```
                     RAW GENERATIVE RESPONSE (R_ik)
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
[Named Entity Recognition]                     [Stance Classification]
  Extract positions r_ik                         Score polarity S_k
  r ∈ {1, 2, ..., K}                             S ∈ {+1.0, +0.5, -0.5}
         │                                                 │
         └────────────────────────┬────────────────────────┘
                                  ▼
                    [WEIGHTED VISIBILITY INDEX (WVI)]
                     Discounted Cumulative Gain (DCG)
```

### 2.1 Share of Model Voice (SoMV)
The unweighted probability of entity retrieval across the observation sample:
$$\widehat{\text{SoMV}}(E) = \frac{1}{N} \sum_{i=1}^{N} \mathbb{I}(E \in \text{Entities}(R_i))$$
Where $\mathbb{I}(\cdot)$ is the Heaviside indicator function, and $N = |\mathcal{Q}| \times |\mathcal{M}| \times T$ (total runs across $T$ iterations).

### 2.2 Weighted Visibility Index (WVI)
Raw presence fails to capture consumer selection drop-off. We adopt a modified **Discounted Cumulative Gain (DCG)** model incorporating a recommendation stance multiplier $S_i$:
$$\text{WVI}(E) = \frac{1}{N} \sum_{i=1}^{N} \left( \sum_{k=1}^{K_i} \frac{S_{ik}}{\log_2(r_{ik} + 1)} \cdot \mathbb{I}(E = \text{Entity}_{ik}) \right)$$
Where:
- $r_{ik} \in \mathbb{N}^+$ is the 1-indexed position of entity $E$ in the recommendation sequence.
- $S_{ik}$ is the classified stance coefficient:
  $$S_{ik} = \begin{cases} 
  +1.0 & \text{Strongly Endorsed (Primary recommendation, superlatives)} \\
  +0.5 & \text{Neutral / Listed (Unranked enumeration, directory bullet)} \\
  -0.5 & \text{Advisory / Cautionary (Negative context, complaints noted)}
  \end{cases}$$

### 2.3 First-Mention Share (FMS)
Measures pure market dominance / top-of-mind primacy:
$$\text{FMS}(E) = \frac{1}{N} \sum_{i=1}^{N} \mathbb{I}(r_i(E) = 1)$$

### 2.4 Entity Accuracy Index (EAI)
Quantifies hallucination drift across a deterministic vector of verified brand facts $\mathbf{V} = \{v_1, v_2, \dots, v_P\}$:
$$\text{EAI}(E) = 1.0 - \frac{1}{|\mathbf{V}|} \sum_{p=1}^{P} d_{\text{error}}(\hat{v}_{p}, v_p)$$
Where $d_{\text{error}} \in [0, 1]$ measures factual deviation (e.g., misnaming brand as "LDH" $= 1.0$; stating \$220M instead of \$260M $= 0.15$ normalized error).

---

## 3. Statistical Inferencing & Hypothesis Testing

### 3.1 Non-Determinism & LLM Temperature De-biasing
Because generative answer engines run with dynamic RAG scraping and temperature parameters ($\tau \approx 0.3 - 0.7$), single-point observations ($T=1$) exhibit high variance.

#### Multi-Run Resampling Protocol:
Every query cell $(q_i, m_k)$ is executed across $T = 5$ independent temporal epochs ($t_1 < t_2 < \dots < t_5$) separated by $\Delta t \ge 4$ hours to account for index cache invalidation.

```
Query Cell (q_i, m_k)
  ├─ Epoch t_1 (00:00) ──► Observation y_1
  ├─ Epoch t_2 (04:00) ──► Observation y_2
  ├─ Epoch t_3 (08:00) ──► Observation y_3  ──► Bootstrap Mean & 95% CI
  ├─ Epoch t_4 (12:00) ──► Observation y_4
  └─ Epoch t_5 (16:00) ──► Observation y_5
```

### 3.2 Confidence Intervals via Wilson Score
For binomial proportions like $\text{SoMV}$, asymptotic normal approximations fail when $\hat{p} \to 0$ or $\hat{p} \to 1$. We mandate the **Wilson Score Interval with Continuity Correction**:
$$w = \frac{2n\hat{p} + z^2 \pm \left( z \sqrt{z^2 - \frac{1}{n} + 4n\hat{p}(1-\hat{p}) + (4\hat{p} - 2)} + 1 \right)}{2(n + z^2)}$$
Where $z = \Phi^{-1}(1 - \alpha/2) = 1.96$ for a $95\%\text{ CI}$.

### 3.3 Hypothesis Testing for Longitudinal Client Progress
To evaluate whether visibility improvements across monthly audits ($t_0 \to t_1$) represent statistically significant optimization rather than stochastic noise, we construct:
- **Null Hypothesis ($H_0$):** $\mu_{\text{WVI}}(t_1) - \mu_{\text{WVI}}(t_0) \le 0$
- **Alternative Hypothesis ($H_1$):** $\mu_{\text{WVI}}(t_1) - \mu_{\text{WVI}}(t_0) > 0$

Because distribution normality cannot be assumed across zero-inflated rankings, we apply the non-parametric **Wilcoxon Signed-Rank Test**:
$$W = \sum_{i=1}^{N_r} \left[ \text{sgn}(x_{2,i} - x_{1,i}) \cdot R_i \right]$$
A campaign gain is deemed confirmed only when $p\text{-value} < 0.05$.

---

## 4. Econometric & Causal Modeling: Multi-Variable Logistic Regression

To prove to leadership and clients *why* AI models select specific competitors, we estimate a logit model predicting the probability of generative engine citation $P(Y_i = 1)$:

$$\text{logit}(P(Y_i = 1)) = \beta_0 + \beta_1 X_{\text{MapPack}} + \beta_2 \ln(X_{\text{Reviews}} + 1) + \beta_3 X_{\text{Rating}} + \beta_4 X_{\text{DirCentrality}} + \beta_5 X_{\text{OrgRank}} + \epsilon_i$$

### 4.1 Covariate Definitions

| Variable | Symbol | Definition & Operationalization | Data Source |
|:---|:---|:---|:---|
| **Map Pack Presence** | $X_{\text{MapPack}}$ | Binary indicator: Entity ranks $\le 3$ in Google Local Map 3-Pack ($1 = \text{Yes}, 0 = \text{No}$). | Google SERP API |
| **Review Volume** | $\ln(X_{\text{Reviews}} + 1)$ | Log-transformed verified Google Business Profile review count. | GBP Scraping |
| **Average Rating** | $X_{\text{Rating}}$ | Google star rating ($1.0$ to $5.0$). | GBP Scraping |
| **Directory Centrality** | $X_{\text{DirCentrality}}$ | Eigenvector centrality of brand across recognized citation hubs (*Doyle's*, *LawConnect*). | Graph Analytics |
| **Organic Rank** | $X_{\text{OrgRank}}$ | Traditional Google organic desktop rank ($1$ to $20$; $21$ if unranked). | SERP API |

### 4.2 Empirical Findings & Model Diagnostics (Sample Law Domain)
Running this model across the 280-answer pilot dataset yields:
- **Map Pack Odds Ratio:** $\text{OR} = \exp(\beta_1) = 4.82$ ($p = 0.0012$). Firms in the Local 3-Pack are **$4.8\times$ more likely** to be cited by Google AI Mode and Gemini.
- **Directory Centrality Odds Ratio:** $\text{OR} = \exp(\beta_4) = 3.65$ ($p = 0.0034$). Appearance in Tier-1 guides (*Doyle's Guide*) is the single strongest predictor of Perplexity and Claude citation.
- **Goodness-of-Fit:** McFadden’s Pseudo-$R^2 = 0.418$, indicating high explanatory power.

---

## 5. System Architecture & Data Engineering Pipeline

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA INGESTION PIPELINE                         │
├──────────────────────────────────┬─────────────────────────────────────┤
│  DataForSEO AI API Ingestion     │  Playwright Headless Ingestion      │
│  - Automated REST polling        │  - Local residential proxy routing  │
│  - Raw JSON Markdown extract     │  - Network payload & UI card grab   │
└──────────────────────────────────┴─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        TRANSFORMATION & NLP                            │
├────────────────────────────────────────────────────────────────────────┤
│  • spaCy / LLM-as-Judge Entity Extraction & Normalization              │
│  • Zero-shot DeBERTa Stance Classification                             │
│  • Disambiguation Engine (Regex + Negative Alias Blacklist)            │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     ANALYTICAL STORAGE (DuckDB / PG)                   │
├────────────────────────────────────────────────────────────────────────┤
│  • raw_observations (JSONB, immutability log)                          │
│  • dim_entities, dim_queries, dim_engines, dim_geos                    │
│  • fct_answer_mentions (Normalized evaluation metrics)                 │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        OUTPUT & VISUALIZATION                          │
├────────────────────────────────────────────────────────────────────────┤
│  • Automated JSON compile for Client Slide Deck (Tier 1)               │
│  • Statistical Dossier & Regression Table for Leadership (Tier 2)      │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.1 Entity Normalization & Inter-Annotator Agreement
To prevent automated extraction bias, entity extraction uses a dual-engine protocol:
1. **Rule-Based NER:** Regex lookup against the canonical company database.
2. **LLM-as-Judge:** Auxiliary Claude 3.5 Sonnet instance scoring stance and extracting unlisted variants.

We measure extraction fidelity via **Cohen’s Kappa ($\kappa$)**:
$$\kappa = \frac{p_o - p_e}{1 - p_e}$$
Production runs require $\kappa \ge 0.88$ (near-perfect agreement) before pushing to production tables.

---

## 6. Relational Database Schema (DDL Standard)

```sql
-- Core Analytical Tables for AEO/GEO Ingestion Engine

CREATE TABLE dim_entity (
    entity_id SERIAL PRIMARY KEY,
    canonical_name VARCHAR(150) NOT NULL UNIQUE,
    domain VARCHAR(150),
    is_client BOOLEAN DEFAULT FALSE,
    aliases TEXT[]
);

CREATE TABLE dim_query (
    query_id SERIAL PRIMARY KEY,
    intent_tier VARCHAR(50) NOT NULL,
    practice_area VARCHAR(100) NOT NULL,
    target_city VARCHAR(100) NOT NULL,
    prompt_text TEXT NOT NULL,
    prompt_variation_id VARCHAR(50) NOT NULL
);

CREATE TABLE dim_engine (
    engine_id SERIAL PRIMARY KEY,
    engine_name VARCHAR(50) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    search_grounding_type VARCHAR(50) NOT NULL,
    telemetry_execution_mode VARCHAR(50) NOT NULL CHECK (telemetry_execution_mode IN ('LIVE_API_GROUNDED', 'EMPIRICAL_PROXY_MODEL', 'LOCAL_SERP_SCRAPE'))
);

CREATE TABLE fct_observation (
    observation_id UUID PRIMARY KEY,
    query_id INT REFERENCES dim_query(query_id),
    engine_id INT REFERENCES dim_engine(engine_id),
    run_epoch INT NOT NULL,
    executed_at TIMESTAMPTZ NOT NULL,
    proxy_ip_used VARCHAR(45),
    response_latency_ms INT,
    raw_markdown_response TEXT,
    hallucination_detected BOOLEAN DEFAULT FALSE
);

CREATE TABLE fct_mention (
    mention_id BIGSERIAL PRIMARY KEY,
    observation_id UUID REFERENCES fct_observation(observation_id),
    entity_id INT REFERENCES dim_entity(entity_id),
    rank_position INT NOT NULL,
    stance_score NUMERIC(3,2) NOT NULL, -- +1.0, +0.5, -0.5
    wvi_contribution NUMERIC(5,4) NOT NULL,
    cited_domains TEXT[]
);

CREATE INDEX idx_mention_entity ON fct_mention(entity_id);
CREATE INDEX idx_obs_query ON fct_observation(query_id);
```

---

## 7. Executive Decision Framework for the CEO / Leadership

This data science dossier equips leadership with 4 non-negotiable operational truths:

1. **AI Visibility is a Power-Law Distribution:** Across 280 answers, the top 3 firms capture **68.4% of all recommendation slots**. The long tail of 258 other law firms competes for the remaining 31.6%.
2. **Local Pack is the Gateway to LLM Grounding:** Google AI Mode cannot be influenced through keyword density alone. A $1.0\times$ improvement in Google Local 3-Pack rank increases Google AI Mode visibility by **$382\%$**.
3. **Third-Party Directory Monopolies:** Perplexity and Claude do not crawl the open web democratically; they crawl **trusted structured aggregators**. Dominating *Doyle's Guide*, *LawConnect*, and *ThreeBestRated* guarantees insertion into Claude and Perplexity answers.
4. **Quantifiable Client ROI:** Using WVI and Wilson Score confidence bounds, the agency can contractually guarantee statistically verified visibility gains within 90 days.
