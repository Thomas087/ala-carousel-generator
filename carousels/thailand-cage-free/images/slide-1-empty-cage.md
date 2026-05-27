# Image spec — Slide 1 · "The cages"

**Target file:** `slide-1-empty-cage.png`
**Used by:** `../index.html`, slide 1 (`54 million` — hens in battery cages)
**Role in slide:** Single hero subject anchored to the bottom of the slide, floating on the navy (`#0D1D36`) background as a clean cut-out — **no background, no scene box**.

---

## ⚠️ Art-direction rule (applies to EVERY image in this carousel)

**Never depict a live animal in farming conditions, and never depict animal suffering.**
Photorealistic AI images of caged or distressed animals can be exposed as AI-generated and used to discredit the campaign. This carousel therefore uses **animal-free, symbolic objects only.** No hens, chicks, birds, or any living animal. No blood, no death, no distress.

## Output requirements (non-negotiable)

- **Format:** PNG-24 with a real **alpha channel** (transparency). NOT a flattened white/checkerboard background.
- **Background:** 100% transparent (alpha = 0 everywhere except the cage object).
- **No baked-in shadow, gradient, vignette, ground plane, or frame.** The slide adds its own drop-shadow and glow in CSS.
- **Canvas:** square, **1536 × 1536 px** (1024 min).
- **Composition:** subject centered horizontally, ~80% of frame height, **bottom-weighted** (the slide anchors it to its lower edge). A few px of transparent padding so edges aren't clipped.

## Subject & art direction

**An empty wire battery cage**, shown as a single clean isolated object — bare metal mesh, a feeder trough and the sloped wire floor visible, the door closed or slightly ajar. **It is empty: no bird, no animal, nothing living inside.** It reads as the symbol of confinement, not as a scene of suffering. Sober, factual, editorial.

- **Style:** clean editorial still-life / product photography; soft neutral studio light; crisp wire; cool-grey galvanised metal, lightly aged (not heavily rusted/grimy).
- **Palette:** muted metal greys, slightly desaturated so it sits calmly against navy. Keep enough light on the wire that it reads on a dark background.
- **Mood:** stark and empty — the emptiness is the point.

## Prompt (ready to paste)

Subject only — the generator appends the green screen.

> Clean editorial still-life photograph of a single empty wire battery cage for laying hens, bare galvanised metal mesh, a feed trough along the front and a gently sloped wire floor, door closed, completely empty with no animal inside, soft neutral studio lighting, lightly aged cool-grey metal, sober factual tone.

**Negative prompt:**
> hen, chicken, bird, animal, live animal, feathers, egg, blood, gore, dead animal, distress, suffering, person, hand, background, room, barn, floor, drop shadow, cast shadow, gradient, vignette, text, watermark, logo, cartoon, illustration, oversaturated, green spill or green tint on the cage

## Generation (project standard)

`gpt-image-2`, quality `low`, rendered on a flat green screen, then chroma-keyed to transparency — the thin wire gaps must cut through (alpha between the wires, not filled). Run via the **generating-carousel-images** skill:

```bash
.claude/skills/generating-carousel-images/generate_cutout.sh \
  carousels/thailand-cage-free/images/slide-1-empty-cage.png \
  "<subject prompt>. Do not include: <negatives>, green spill or green tint on the cage." 1024x1024
```
Do not request `background:"transparent"` — gpt-image-2 rejects it.

## Acceptance check

- [ ] No animal of any kind; cage is clearly empty.
- [ ] Transparent after keying, including gaps between wires — no green box, no grey/white halo.
- [ ] No green fringe on the wire (despill handled it; tune `KEY_LO`/`KEY_HI` if not).
- [ ] Reads clearly at ~520px wide (its on-slide size).
