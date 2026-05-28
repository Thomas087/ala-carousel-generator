# ALA Carousel Generator

Make Instagram-style data-journalism carousels for **ALA — *Accountability Lens
Asia*** — driven by Claude Code skills. You describe a topic, Claude writes the
slides, lays them out in HTML matching ALA's design system, generates per-slide
AI imagery, and exports posting-ready PNGs and a single PDF.

Every slide is `1080 × 1350` (4:5), built from a small shared design system
(one CSS file, two fonts, four base templates).

> **You'll get the most out of this repo by opening it in
> [Claude Code](https://claude.com/claude-code).** Everything below also works
> from the command line, but the end-to-end pipeline is driven by skills
> in `.claude/skills/`.

## Contents

1. [Prerequisites](#prerequisites)
2. [One-time setup](#one-time-setup)
3. [Make a carousel (the Claude skill)](#make-a-carousel-the-claude-skill)
4. [What the pipeline actually does](#what-the-pipeline-actually-does)
5. [Project layout](#project-layout)
6. [Design system at a glance](#design-system-at-a-glance)
7. [Editing or exporting manually](#editing-or-exporting-manually)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

You need three system tools installed yourself. Everything else `npm run setup`
will install for you.

| Tool         | Why                                                                       | macOS install                |
| ------------ | ------------------------------------------------------------------------- | ---------------------------- |
| Node.js ≥ 20 | runs the Playwright HTML → PNG/PDF exporter                               | `brew install node@22`       |
| Python 3     | runs the chroma-key script that turns green-screen AI images into PNGs    | already on macOS, or `brew install python` |
| `jq`         | parses the OpenAI Images API response                                     | `brew install jq`            |

The repo pins Node to version `22` via `.nvmrc` — if you use `nvm`, run
`nvm use` once inside the repo.

You'll also need an **OpenAI API key** with access to the `gpt-image-2` model.
Get one at <https://platform.openai.com/api-keys>.

## One-time setup

```bash
git clone <this-repo>
cd ala_carousel_generator
npm run setup            # installs everything (see below)
cp .env.example .env     # then paste your OpenAI key into .env
```

`npm run setup` does three things in order:

1. `npm install` inside `design_system/` (pulls in Playwright).
2. `playwright install chromium` (the headless browser used for rendering
   and PNG/PDF export).
3. Creates `.venv/` at the repo root and pip-installs `numpy` + `Pillow` into
   it. The image-generation pipeline auto-discovers this venv — you don't need
   to activate it.

Quick sanity check:

```bash
node --version                              # should be ≥ 20
.venv/bin/python -c "import numpy, PIL"     # silent = good
jq --version                                # any version
```

## Make a carousel (the Claude skill)

Open the repo in Claude Code and just ask:

> *"Make me a full carousel about cage-free egg laws in Thailand and export it."*

Claude has a skill called **`creating-ala-carousels`** that picks up phrases
like *"make me a full carousel about X"*, *"build a finished carousel from
scratch"*, *"run the whole carousel pipeline"*, *"take this carousel all the
way to PDF"*. When triggered, it does this:

### Step 1 — One question first

Claude asks: ***"Do you want to give me the slide wording yourself, or should
I generate it?"***

- **You provide the wording** — paste your slides (one stat + caption +
  source per slide). Claude takes the copy verbatim. The topic can be
  *anything* — no chicken-farming requirement on this path.
- **Claude generates the wording** — Claude switches to the
  **`chicken-farming-carousel-concept`** skill, which is country-specific
  and intensive-poultry-themed. It will ask you a few short follow-ups
  (which country, which anchor stat, then approve the final wording).

### Steps 2–4 — Pipeline runs through

Once the wording is settled, Claude runs three sub-skills back to back, with
no extra checkpoints:

| Step | Skill                         | What it produces                                              |
| ---- | ----------------------------- | ------------------------------------------------------------- |
| 2    | `building-carousel-slider`    | `carousels/<slug>/index.html` + an image `.md` spec per slide |
| 3    | `generating-carousel-images`  | a transparent PNG cut-out per slide in `images/`              |
| 4    | `exporting-carousel-slider`   | `export/slide-N.png` + `export/<slug>.pdf`                    |

Step 3 spends OpenAI image credits — that's expected, not a reason to pause.
At the end Claude reports the deliverable paths and you have a folder ready
to post.

### Calling any single stage directly

You don't have to run the whole pipeline. Each sub-skill triggers on its own
phrases:

- *"Build the slider HTML from this wording"* → `building-carousel-slider`
- *"Generate the carousel images"* → `generating-carousel-images`
- *"Export the slider to PNG and PDF"* → `exporting-carousel-slider`

## What the pipeline actually does

```
your topic (or your wording)
        │
        ▼
┌──────────────────────────────────┐
│ chicken-farming-carousel-concept │  (skipped if you supplied wording)
│   → slide copy + sources         │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ building-carousel-slider         │
│   → carousels/<slug>/index.html  │
│   → carousels/<slug>/images/*.md │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ generating-carousel-images       │
│   gpt-image-2 → green screen     │
│   → chroma-key → transparent PNG │
│   → carousels/<slug>/images/*.png│
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ exporting-carousel-slider        │
│   → carousels/<slug>/export/*.png│
│   → carousels/<slug>/export/<slug>.pdf
└──────────────────────────────────┘
```

A finished carousel folder looks like:

```
carousels/vietnam-broilers/
├── index.html                  ← open in a browser to preview the slider
├── README.md                   ← topic + sources
├── images/
│   ├── slide-1-chicken.md      ← prompt + acceptance checklist
│   ├── slide-1-chicken.png     ← transparent cut-out on alpha
│   ├── slide-2-candle.md
│   ├── slide-2-candle.png
│   └── …
└── export/
    ├── slide-1.png             ← 2160 × 2700 by default (×2 scale)
    ├── slide-2.png
    ├── …
    └── vietnam-broilers.pdf
```

### Image safety rule

The slider-builder enforces one hard rule: **no image ever depicts a live or
suffering animal**. Imagery is symbolic and animal-free — an empty cage, an
A4 sheet, eggs, a carton, a shopping basket, a barn exterior. A photorealistic
AI hen could be exposed as AI-generated and used to discredit the campaign;
symbolic objects can't. The rule lives in every image spec's prompt and
negative prompt.

### Why the green-screen detour for images?

`gpt-image-2` refuses `background:"transparent"` outright, and asking for
transparency in the prompt only paints a fake checkerboard. So the pipeline
generates an opaque image on a flat green screen, then `chroma_key.py` (numpy
+ Pillow) keys the green out to real alpha. That's what the Python venv from
setup is for.

### Why a dedicated PDF exporter?

Chromium's `page.pdf()` downsamples image-heavy slides to a few pixels —
blank or blurry output. `design_system/export-slider.mjs` instead screenshots
each `.slide` element at full resolution and embeds the screenshots into a
hand-built PDF, one slide per page.

## Project layout

```
ala_carousel_generator/
├── package.json                ← root scripts: npm run setup, export, export:slider
├── requirements.txt            ← Python deps (numpy, Pillow) for chroma-keying
├── .nvmrc                      ← Node version pin (22)
├── .env.example                ← copy → .env, paste OPENAI_API_KEY
├── assets/                     ← the brand logo PNGs used on every slide
├── sample_slides/              ← reference Instagram posts the design system was derived from
├── design_system/
│   ├── index.html              ← live styleguide — open first to see the palette + components
│   ├── css/design-system.css   ← all tokens and reusable component classes
│   ├── templates/              ← cover · big-stat · two-stat · chart (the four base slide layouts)
│   ├── export.mjs              ← exports the four standalone templates → PNG
│   └── export-slider.mjs       ← exports a finished slider → PNG + PDF
├── carousels/                  ← finished work; one folder per topic
└── .claude/skills/             ← the Claude Code skills that drive the pipeline
    ├── creating-ala-carousels/             ← the orchestrator
    ├── chicken-farming-carousel-concept/   ← generates slide copy for a country
    ├── building-carousel-slider/           ← wording → HTML + image specs
    ├── generating-carousel-images/         ← specs → transparent PNGs (uses .venv)
    └── exporting-carousel-slider/          ← slider → PNG-per-slide + PDF
```

## Design system at a glance

| Token             | Value     | Use                                  |
| ----------------- | --------- | ------------------------------------ |
| `--ala-navy`      | `#0D1D36` | flat slide background, brand ink     |
| `--ala-yellow`    | `#F9CC11` | hero numbers, emphasis words         |
| `--ala-white`     | `#F5F3EC` | warm off-white body text             |
| `--ala-olive`     | `#67604E` | secondary / "rest" chart data        |
| `--ala-navy-grid` | `#1B2B47` | faint graph-paper grid texture       |

**Fonts** (free Google Fonts loaded by the stylesheet):

- **Display → [Lilita One](https://fonts.google.com/specimen/Lilita+One)** —
  chunky rounded display; ALL-CAPS headlines and every hero number.
- **Body → [Poppins](https://fonts.google.com/specimen/Poppins)** (400 / 500 /
  600) — captions, legends, labels.

These are close free substitutes for ALA's real display face. To swap in the
brand fonts, edit the `@import` at the top of `design_system/css/design-system.css`
and update `--ala-font-display` / `--ala-font-body`. *(An alternative display
match: swap Lilita One for [Anton](https://fonts.google.com/specimen/Anton) if
you want a more condensed, poster-like headline.)*

Open `design_system/index.html` in a browser for a live tour of the palette,
type scale, and components.

## Editing or exporting manually

You don't have to use the skills. Each piece works on its own.

**Make a single new slide**

1. Copy the closest template from `design_system/templates/`.
2. Edit the text. Useful knobs:
   - Headline line: `<span class="line line--yellow">` or `line--white`.
   - Inline emphasis: `<span class="ala-em-yellow">…</span>`.
   - Donut share: `style="--pct: 38"` on `.ala-donut`.
3. The logo and grid are reusable: `<img class="ala-logo" …>` and
   `<div class="ala-grid"></div>`.

**Export the four standalone templates → PNG**

```bash
npm run export                          # → design_system/exports/*.png
node design_system/export.mjs /out/dir  # custom output directory
```

**Export an existing slider → PNG + PDF**

```bash
node design_system/export-slider.mjs carousels/<slug>            # ×2 scale (2160×2700)
node design_system/export-slider.mjs carousels/<slug> --scale 1  # exact 1080×1350
```

PNGs are cropped exactly to the `.ala-slide` element, rendered at 2× by
default for crisp output. No setup at all? Just open any slide HTML in a
browser and screenshot it.

## Troubleshooting

| Symptom                                       | Likely cause                                            | Fix                                                                                |
| --------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `OPENAI_API_KEY not set`                      | no `.env` at repo root, or value is blank               | `cp .env.example .env` and paste your key                                          |
| `externally-managed-environment` on setup     | a system pip is being used instead of `.venv/`          | use `npm run setup:python` — it creates a venv (PEP 668 — modern Python defaults)  |
| `playwright: command not found` when exporting| Node deps not installed                                 | `npm run setup:node` (or rerun `npm run setup`)                                    |
| Exported slide is blank or shrunken           | hand-rolled `page.screenshot()` instead of using the script | use `node design_system/export-slider.mjs <folder>` — it dodges two non-obvious traps |
| Slider shows the dashed placeholder           | image PNGs haven't been generated yet                   | run the `generating-carousel-images` skill (or the full pipeline), then re-export  |
| Green halo around the subject in an image     | chroma-key threshold too loose                          | re-run with a lower `--hi`, e.g. `KEY_HI=80 ./generate_cutout.sh …`                |
| Subject edges look "eaten" / pitted           | chroma-key threshold too tight                          | re-run with a higher `--lo`, e.g. `KEY_LO=60 ./generate_cutout.sh …`               |
