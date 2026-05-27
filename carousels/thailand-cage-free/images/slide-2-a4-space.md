# Image spec — Slide 2 · "The space"

**Target file:** `slide-2-a4-space.png`
**Used by:** `../index.html`, slide 2 (`620 cm²` — less space than a sheet of A4)
**Role in slide:** Hero subject anchored to the bottom, floating on navy (`#0D1D36`). Must make the **"a hen has less room than one sheet of paper"** idea legible — using the paper itself as the unit, **no live animal**.

---

## ⚠️ Art-direction rule (applies to EVERY image in this carousel)

**Never depict a live animal in farming conditions, and never depict animal suffering.** Animal-free, symbolic objects only. (A flat, obviously-graphic pictogram is acceptable; a realistic or photographic animal is not.)

## Output requirements (non-negotiable)

- **Format:** PNG-24 with a real **alpha channel**. Not flattened onto white.
- **Background:** 100% transparent (alpha = 0 except the paper sheet + printed marks).
- **No baked-in shadow, ground plane, gradient, or frame.** The slide adds its own glow/shadow.
- **Canvas:** square, **1536 × 1536 px** (1024 min).
- **Composition:** the A4 sheet sits centered, **bottom-weighted**, shown in gentle perspective or flat-on, all four corners visible.

## Subject & art direction

**One sheet of white A4 paper** presented as a measuring unit. On the paper, printed as clean flat infographic marks: dimension lines and labels reading **"21 cm"** (short edge) and **"29.7 cm"** (long edge), and a small **flat single-colour hen pictogram** (a simple wayfinding-style silhouette, clearly a printed icon — NOT a realistic or distressed animal) sized to nearly fill the sheet, conveying "she barely fits." The paper is the hero; the pictogram is a minimal graphic on it.

- **Style:** clean editorial still-life of a real white paper sheet, with crisp printed vector-style graphics on its surface; soft even top light; bright slightly-warm white paper with sharp corners so it stays visible against navy.
- **Palette:** white paper, dark-grey/charcoal printed marks, optionally one yellow accent line (`#F9CC11`) to tie to the brand.
- **Clarity:** the rectangle and its dimensions are the message — keep them sharp and unmistakable; do not crop the sheet.

## Prompt (ready to paste)

Subject only — the generator appends the green screen.

> Clean editorial still-life of a single sheet of bright white A4 paper shown flat with all four corners visible, printed on its surface with crisp flat infographic dimension lines and labels reading "21 cm" and "29.7 cm", plus a simple flat single-colour hen pictogram (a minimal wayfinding-style silhouette) sized to nearly fill the page, soft even top lighting, sharp corners, sober infographic tone.

**Negative prompt:**
> realistic chicken, photographic hen, live animal, feathers, 3d animal, distress, suffering, blood, background, table, floor, scene, drop shadow, cast shadow, gradient, vignette, watermark, logo, handwriting, crumpled paper, paper cropped off-frame, cartoon character, oversaturated, green spill or green tint on the paper

## Generation (project standard)

`gpt-image-2`, quality `low`, rendered on a flat green screen, then chroma-keyed to transparency. A green screen is essential here: the white sheet survives (green ≠ white), where ML matting eats it. Run via the **generating-carousel-images** skill:

```bash
.claude/skills/generating-carousel-images/generate_cutout.sh \
  carousels/thailand-cage-free/images/slide-2-a4-space.png \
  "<subject prompt>. Do not include: <negatives>, green spill or green tint on the paper." 1024x1024
```
Do not request `background:"transparent"` — gpt-image-2 rejects it.

> Note: generators are unreliable with exact text. If "21 cm" / "29.7 cm" render garbled, generate the plain paper + pictogram and add the dimension labels later in a vector/design tool, or drop them and rely on the slide's caption.

## Acceptance check

- [ ] No realistic/photographic animal — only a flat graphic pictogram, if any.
- [ ] Transparent after keying; white A4 sheet present, bright, all four corners visible.
- [ ] Dimension marks legible (or cleanly omitted) — sheet reads as a measurable rectangle.
- [ ] No green box/halo, no green fringe on the white edges.
- [ ] Reads clearly at ~520px wide.
