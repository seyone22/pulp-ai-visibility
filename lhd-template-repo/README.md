# LHD Lawyers: AI visibility report (October 2026)

How often AI assistants name LHD Lawyers against competing personal-injury firms, city by city, plus the plan to close the gap. It is built as an animated 30-slide HTML deck.

- **Panel:** 8 cities × 7 questions × 5 assistants (ChatGPT, Gemini, Google AI Mode, Perplexity, Claude) = 280 answers, plus Google organic results with AI Overviews. Collected via DataForSEO in October 2026.
- **Live:** https://lhd-ai-visibility.pages.dev (private, access-code gate)

## Layout

| Path | What it is |
|---|---|
| `pipeline/raw/` | Raw DataForSEO responses, one file per `city__question__platform` |
| `pipeline/*.json` | Derived data: `answers.json`, `canon.json`, `ans_full.json`, `metrics.json`, `hist.json`, `map.json` |
| `pipeline/build.mjs` | Builds the deck (`deck.css` and `deck.js` are inlined) to `pipeline/out/lhd-ai-visibility.html` |
| `site/` | What is deployed: `index.html`, the PDF, `robots.txt`, `_headers` |
| `functions/_middleware.js` | Access-code gate for Cloudflare Pages (code in the `REPORT_PASSWORD` secret) |

## Rebuild the deck

```sh
npm install
npm run build        # pipeline/build.mjs + make_site.mjs -> site/index.html
npm run deploy       # needs wrangler login on the Uprise Cloudflare account; run from the repo root so functions/ is included
```

## Re-run the data (costs API credit)

Copy `.env.example` to `.env` and fill it in. Then, from `pipeline/`:

1. `node collect.mjs`: AI answers and SERPs into `raw/` (skips files that exist; `collect2.mjs` retries gaps)
2. `node parse.mjs`: produces `answers.json`
3. `node extract.mjs`: firm names per answer via Claude, into `extract/` (not kept in the repo; `ans_full.json` has the result)
4. `node canon.mjs`: merges name variants into `canon.json`
5. `node analyze.mjs` and `node metrics.mjs`: produce `ans_full.json` and `metrics.json`
6. `node hist.mjs`: LLM-mentions history into `hist.json`
7. `node map.mjs`: the Australia map into `map.json`

`rec.mjs` records animation frames with headless Chrome (set `CHROME_PATH` if it isn't in the default Windows location). The PDF was printed with Chrome `--print-to-pdf` from `out/lhd-ai-visibility.html?static=1`.
