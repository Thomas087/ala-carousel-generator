# Image spec — Slide 2 · "short life"

**Target file:** `slide-2-candle.png`
**Used by:** `../index.html`, slide 2 (`42 days` — all most meat chickens get)
**Role in slide:** Single hero subject anchored to the bottom of the slide, floating on the navy (`#0D1D36`) background as a clean cut-out — **no background, no scene box**.

---

## ⚠️ Art-direction rule (applies to EVERY image in this carousel)

**Never depict a live animal in farming conditions, and never depict animal suffering.**
Use **animal-free, symbolic objects only** (here, a candle). A flat, obviously-graphic pictogram is acceptable; a realistic or photographic animal is not. No blood, death, or distress.

## How to generate (consistent across this project)

Generate with **`gpt-image-2`**, **quality `low`**, rendered **opaque on a flat green screen**, then **chroma-key** the green out to transparency. The `generating-carousel-images` skill does both steps via `generate_cutout.sh`.

## Output requirements (non-negotiable)

- **Final asset:** PNG-24 with a real **alpha channel** — the subject as a clean cut-out, 100% transparent everywhere else.
- **No baked-in shadow, gradient, vignette, ground plane, or frame.** The slide adds its own drop-shadow and glow in CSS.
- **Canvas:** **1024 × 1536** (portrait) — a standing candle with a smoke curl above reads best tall.
- **Composition:** subject centered horizontally, ~80% of frame height, **bottom-weighted**, with a little padding above for the smoke.

## Subject & art direction

A single **partially-burned pillar candle that has just been snuffed out** — **no flame**, the blackened wick faintly glowing, with a **thin delicate curl of pale grey smoke rising** from it. A life cut short. Cream/ivory wax, a little melted wax at the rim, sober editorial still-life, slightly desaturated so it reads on dark navy. Even neutral lighting; no holder, no table, no scene.

## Prompt (ready to paste)

Describe the **subject only** — do **not** mention the background.

> A single partially-burned ivory pillar candle just snuffed out with no flame, the blackened wick faintly glowing and a thin delicate curl of pale grey smoke rising from it, sober editorial still-life, slightly desaturated, even neutral lighting.

**Negative prompt:**
> live animal, hen, chicken, bird, suffering, distress, blood, dead animal, lit flame, burning flame, fire, candle holder, table surface, background, room, scene, drop shadow, cast shadow, gradient, vignette, text, watermark, logo, cartoon, oversaturated, green spill or green tint on the subject

## Generation (project standard)

```bash
.claude/skills/generating-carousel-images/generate_cutout.sh \
  carousels/vietnam-broilers/images/slide-2-candle.png \
  "A single partially-burned ivory pillar candle just snuffed out with no flame, the blackened wick faintly glowing and a thin delicate curl of pale grey smoke rising from it, sober editorial still-life, slightly desaturated, even neutral lighting. Do not include: live animal, bird, lit flame, burning flame, fire, candle holder, table surface, background, scene, drop shadow, gradient, text, watermark, logo, green spill or green tint on the subject." \
  1024x1536
```

## Acceptance check

- [ ] No live animal and no depiction of suffering.
- [ ] Reads as a just-snuffed candle (no flame, thin smoke) — a life cut short.
- [ ] Transparent background after keying — no green box, no grey/white halo; the faint smoke survives keying.
- [ ] No green fringe on edges.
- [ ] Reads clearly at its on-slide size on dark navy.
