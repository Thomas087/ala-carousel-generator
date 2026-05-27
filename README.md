# ALA Carousel Generator

A small, reproducible **design system** and set of **slide templates** for
ALA — *Accountability Lens Asia* — Instagram-style data-journalism carousels.

Every slide is a `1080 × 1350` (4:5) HTML page styled by one shared stylesheet.
Open it in a browser, then export to PNG.

## Layout

```
design_system/
├── index.html              ← styleguide / design-system reference (start here)
├── css/
│   └── design-system.css   ← all tokens + reusable component classes
├── templates/
│   ├── cover.html          ← stacked all-caps headline
│   ├── big-stat.html       ← one hero number + caption
│   ├── two-stat.html       ← two stacked stat blocks
│   └── chart.html          ← donut + centred % + legend
├── assets/
│   ├── ala-logo.png        ← full-colour mark
│   └── ala-logo-white.png  ← white mono mark (locked bottom-left on slides)
├── exports/                ← generated PNGs (1080×1350)
├── export.mjs              ← HTML → PNG exporter
└── package.json

assets/            ← original brand logo
sample_slides/     ← reference slides the system was derived from
```

## Design tokens

| Token | Value | Use |
|---|---|---|
| `--ala-navy` | `#0D1D36` | stage background / brand ink |
| `--ala-yellow` | `#F9CC11` | hero numbers, emphasis words |
| `--ala-white` | `#F5F3EC` | supporting text (warm off-white) |
| `--ala-olive` | `#67604E` | secondary / "rest" chart data |
| `--ala-navy-grid` | `#1B2B47` | faint graph-paper texture |

**Type** (free Google Fonts, loaded via the stylesheet):

- **Display → Lilita One** — chunky rounded display; ALL-CAPS headlines + every hero number.
- **Body → Poppins** (400/500/600) — captions, legends, labels.

> These are close free substitutes for ALA's display face. To use the real
> brand fonts, replace the `@import` at the top of `css/design-system.css` and
> update `--ala-font-display` / `--ala-font-body`. *(Alternative display match:
> swap Lilita One for [Anton](https://fonts.google.com/specimen/Anton) if you
> want a more condensed, poster-like headline.)*

## View the system

Open `design_system/index.html` in a browser — it shows the palette, type scale,
live component demos and links to every template.

## Make a new slide

1. Copy the closest template in `design_system/templates/`.
2. Edit the text. Useful knobs:
   - Headline lines: `<span class="line line--yellow">` / `line--white`.
   - Inline emphasis: `<span class="ala-em-yellow">…</span>`.
   - Donut share: `style="--pct: 38"` on `.ala-donut`.
3. The logo and grid are reusable: `<img class="ala-logo" …>` and `<div class="ala-grid"></div>`.

## Export to PNG

One-time setup (reuses a cached Chromium if present):

```bash
cd design_system
npm install
npx playwright install chromium
```

Then, any time:

```bash
node export.mjs            # renders every template → design_system/exports/*.png
node export.mjs /out/dir   # custom output directory
```

Each PNG is cropped exactly to the `.ala-slide` element at `1080×1350`
(rendered at 2× for crisp output). No setup? Just open a template in a browser
and screenshot the slide.
