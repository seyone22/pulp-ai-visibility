# Reusable AEO / GEO Animated Presentation Deck Generator

This engine automates the generation of client-facing, animated 30-slide presentations modeled after the benchmark `lhd-ai-visibility` deliverable.

## Architecture

```
template-engine/
├── generate.mjs           # Universal deck compiler CLI
├── example-config.json    # Client configuration schema
└── README.md              # Documentation & guide
```

## How to Generate a Deck for Any Client

1. **Create a client config (`client.json`)**:
   - `clientName`: Target agency or firm name (e.g. "Pulp Digital").
   - `clientDomain`: Primary website (e.g. "pulpdigital.com.au").
   - `homeCity`: Primary headquarter city (e.g. "melbourne", "sydney").
   - `primaryAccent`: Brand hex color (e.g. `#FF4D2D` for Pulp, `#2251FF` for LHD).
   - `darkBg` / `paperBg`: Background color palette.
   - `logoSvgPath`: Path to client vector SVG logo.
   - `metricsPath`, `histPath`, `mapPath`: Empirical data JSON files.

2. **Run the generator**:
   ```bash
   node template-engine/generate.mjs --config path/to/client.json --out path/to/output_dir
   ```

3. **Deploy**:
   The output `index.html` is a 100% self-contained, zero-dependency HTML file containing inlined CSS, SVGs, and Vanilla JS presentation controls. It can be deployed directly to Cloudflare Pages, Vercel, AWS S3, or viewed locally in any modern browser.
