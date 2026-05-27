---
name: generating-carousel-images
description: Use when a built ALA carousel slider has image-spec .md files in its images/ folder but the referenced PNGs don't exist yet — generate each slide's transparent cut-out with gpt-image-2 on a green screen, chroma-key the green out, and drop the PNG into images/ so the slider displays it. Triggers: "generate the carousel images", "create the slide images", "fill in the carousel pictures".
---

# Generating ALA carousel images

## Overview

A built carousel (`carousels/<slug>/`) ships an `index.html` plus one `images/slide-N-*.md` spec per image, but no PNGs yet — each `<img>` shows a dashed placeholder. This skill reads every spec, generates the matching **transparent cut-out PNG** at **quality low**, and writes it into `images/`. The HTML's `onload` handler then reveals the image automatically — no HTML edit needed when the `<img>` already exists.

Core principle: **the `.md` spec is the source of truth. Generate exactly what it asks for; never invent imagery, and never relax its image-safety rule.**

## The pipeline: gpt-image-2 → green screen → chroma-key

The slides need **transparent cut-outs** (the slide adds its own glow + drop-shadow via `object-fit:contain`). gpt-image-2 **cannot emit transparency** — `background:"transparent"` returns HTTP 400 ("not supported for this model"), and asking for it in the prompt only paints a fake checkerboard (opaque RGB, no alpha). So instead we render the subject **opaque on a flat green screen** and **chroma-key** the green out. `generate_cutout.sh` does both steps in one call.

Why a green screen and not ML background removal (rembg): keying removes the color *between* gaps (wire mesh, basket weave) and a green backdrop is nothing like a white subject — so it handles the two cases rembg fails at (it fills wire gaps with grey, and it eats white paper). Keying is also a ~25-line numpy step with **no heavy ML dependency** (no onnxruntime, no 170 MB model download). Trade-off: needs despill (built into `chroma_key.py`) to kill green fringe on glossy/metal edges.

## ⚠️ Inherit the spec's image-safety rule

Every spec carries the rule: **no live animal in farming conditions, no animal suffering — animal-free symbolic objects only.** Pass the spec's prompt and negatives through faithfully. Do not add animals, distress, blood, or a realistic creature even if it would feel "more powerful" — a debunked AI image costs more than any punch it buys.

## Workflow

1. **Find the carousel.** Use the folder the user names, else the most recently modified `carousels/*/` with `.md` files in `images/`. If ambiguous, ask.
2. **For each `images/*.md` spec**, parse three things (read the file; don't bash-parse):
   - **Target file** — the `<filename>.png` (must match an `<img src>` in `index.html`).
   - The **Prompt (ready to paste)** blockquote.
   - The **Negative prompt** blockquote.
3. **Compose the prompt.** The OpenAI image API has **no `negative_prompt` field**, so fold negatives into the prompt text. Build it as:
   `<the spec's subject description> Do not include: <negative terms>, green spill or green tint on the subject.`
   Specs are written **subject-only** (no background clause), and `generate_cutout.sh` appends the green-screen instruction. If an **older** spec's prompt still ends with an "isolated on a transparent background…" clause, **drop it** — it would fight the green screen. Always add the green-spill negative.
4. **Skip** any target whose PNG already exists, unless the user asked to regenerate.
5. **Generate** with `generate_cutout.sh` (gpt-image-2 green screen + chroma-key, quality low, square by default):
   ```bash
   .claude/skills/generating-carousel-images/generate_cutout.sh \
     carousels/<slug>/images/<target>.png "<composed prompt>"
   ```
   Run one slide first and eyeball it on a dark background before doing the rest. Pass `1024x1536` or `1536x1024` as the 3rd arg only when the spec calls for a tall/wide subject.
6. **Verify by rendering** (see below), then report per-image: generated / skipped / failed.

## The scripts

- **`generate_cutout.sh OUTPUT_PATH PROMPT [SIZE]`** — the main entry. Appends the green-screen instruction, generates opaque on flat green via `gpt-image-2` (quality low, 1024×1024 default), then runs `chroma_key.py` to write a transparent PNG. Auto-loads `OPENAI_API_KEY` from the nearest `.env`. Tune keying with `KEY_LO` / `KEY_HI` env vars; override the model with `OPENAI_IMAGE_MODEL`.
- **`chroma_key.py INPUT OUTPUT [--lo N] [--hi N]`** — keys the green out (greenness = G − max(R,B), ramped for anti-aliased edges) and **despills** (clamps green down to max(R,B)). Requires `numpy` + `Pillow`. Defaults `--lo 40 --hi 120`; raise `--lo` if the subject is being eaten, lower `--hi` if green halos survive.
- **`generate_image.sh [--ref PATH]... OUTPUT PROMPT [SIZE]`** — the low-level OpenAI API wrapper that `generate_cutout.sh` calls (`output_format=png`, model fallback to `gpt-image-1`). Usable directly for **native transparency** via `gpt-image-1.5`/`gpt-image-1` (`OPENAI_IMAGE_BACKGROUND=transparent`) — a one-step alternative if you don't want the green-key path. **`gpt-image-2` cannot do transparent backgrounds**, which is why the default path keys a green screen instead.

No cropping/matting to 4:5 — the slide places the cut-out with `object-fit:contain; object-position:bottom`, so a square-ish source is right. Don't reintroduce a 4:5 crop.

## Inserting into the HTML

The template already wires each image: `<img src="images/<target>.png" onload="…hide placeholder" onerror="…hide img">`. Dropping the correctly-named PNG into `images/` is the insertion — `onload` fires and the placeholder disappears.

Only edit `index.html` when a spec's **Target file** has **no** matching `<img>` (or an `<img>` has no spec). In that case fix the mismatch (rename the file to match `src`, or add the missing `<img>`/spec) rather than leaving a silent gap.

## Verify (before claiming done)

Render the page headless with the Playwright already installed in `design_system/` and confirm every `.slot-img` actually loaded (`complete && naturalWidth > 0`) and its placeholder is hidden — i.e. no `onerror` fired. Spot-check one generated PNG over a dark background for true transparency (no white box, no grey shadow rectangle). Delete any throwaway render script afterward.

```bash
node -e '
const {chromium}=require("./design_system/node_modules/playwright");
(async()=>{
  const b=await chromium.launch();const p=await b.newPage();
  await p.goto("file://"+require("path").resolve("carousels/<slug>/index.html"),{waitUntil:"networkidle"});
  const r=await p.$$eval(".slot-img",els=>els.map(e=>({src:e.getAttribute("src"),ok:e.complete&&e.naturalWidth>0})));
  console.log(r);await b.close();
})();'
```

## Common mistakes

| Mistake | Fix |
|---|---|
| Passing the negative prompt as an API field | No such field — fold negatives into the prompt text |
| Asking gpt-image-2 for a transparent background | It can't — green-screen + `chroma_key.py` instead (the default path) |
| Keeping the spec's "transparent background" clause in the prompt | Drop it; `generate_cutout.sh` adds the green-screen instruction |
| Forgetting the green-spill negative | Always append "green spill or green tint on the subject" to negatives |
| Green halos / fringe on edges | Despill is built in; lower `KEY_HI`, or `KEY_LO` if the subject is eaten |
| Re-adding the 4:5 crop / sips step | Cut-outs are square/contained; never crop to 4:5 |
| Filename ≠ the `<img src>` | Name the PNG exactly as the spec's **Target file** |
| Inventing a subject / adding an animal | Generate exactly what the spec's prompt says; safety rule holds |
| Quality high "to look better" | The brand brief is quality **low**; keep it low |
| Claiming done without rendering | Render headless; confirm every `.slot-img` loaded |

## Reference files

- `generate_cutout.sh` — main entry: gpt-image-2 green-screen generation + chroma-key → transparent PNG (quality low).
- `chroma_key.py` — green-screen keyer with despill (needs `numpy` + `Pillow`).
- `generate_image.sh` — low-level OpenAI image-API wrapper (also does native transparency via `gpt-image-1.5`/`gpt-image-1`).
