# Image spec — Slide 4 · "rising trend"

**Target file:** `slide-4-chart.png`
**Used by:** `../index.html`, slide 4 (`+77%` — and it keeps climbing)
**Role in slide:** Single hero subject anchored to the bottom of the slide, floating on the navy (`#0D1D36`) background as a clean cut-out — **no background, no scene box**.

---

## ⚠️ Art-direction rule (applies to EVERY image in this carousel)

**Never depict a live animal in farming conditions, and never depict animal suffering.**
Photorealistic AI images of caged or distressed animals can be exposed as AI-generated and used to discredit the campaign. Use **animal-free, symbolic objects only**. A flat, obviously-graphic pictogram is acceptable; a realistic or photographic animal is not. No blood, death, or distress.

## How to generate (consistent across this project)

Generate with **`gpt-image-2`**, **quality `low`**, rendered **opaque on a flat green screen**, then **chroma-key** the green out to transparency. The `generating-carousel-images` skill does both steps via `generate_cutout.sh`.

## Output requirements (non-negotiable)

- **Final asset:** PNG-24 with a real **alpha channel** — the subject as a clean cut-out, 100% transparent everywhere else.
- **No baked-in shadow, gradient, vignette, ground plane, or frame.** The slide adds its own drop-shadow and glow in CSS.
- **Canvas:** **1024 × 1024** (default).
- **Composition:** subject centered horizontally, ~80% of frame height, **bottom-weighted**, with a little padding.

## Subject & art direction

A clean **3-D ascending bar chart** — five rising bars stepping upward to the right, the tallest at the far right, with a simple upward arrow riding over the tops. A single solid accent colour (warm yellow `#F9CC11`) on a neutral grey base reads well against navy. Flat, graphic, sober — an infographic object, not a photo of a screen. No axis numbers or labels. Even neutral lighting; no scene.

## Prompt (ready to paste)

Describe the **subject only** — do **not** mention the background.

> A clean three-dimensional ascending bar chart of five bars rising upward to the right with a simple upward arrow over the tops, warm yellow bars on a neutral grey base, flat graphic infographic style, sober, even neutral lighting.

**Negative prompt:**
> live animal, hen, chicken, bird, suffering, distress, blood, dead animal, background, room, screen, monitor, scene, drop shadow, cast shadow, gradient, vignette, axis numbers, readable text, watermark, logo, cartoon, oversaturated, green spill or green tint on the subject

## Generation (project standard)

```bash
.claude/skills/generating-carousel-images/generate_cutout.sh \
  carousels/vietnam-broilers/images/slide-4-chart.png \
  "A clean three-dimensional ascending bar chart of five bars rising upward to the right with a simple upward arrow over the tops, warm yellow bars on a neutral grey base, flat graphic infographic style, sober, even neutral lighting. Do not include: live animal, bird, background, screen, monitor, scene, drop shadow, gradient, axis numbers, readable text, watermark, logo, green spill or green tint on the subject." \
  1024x1024
```

## Acceptance check

- [ ] No live animal and no depiction of suffering.
- [ ] Transparent background after keying — no green box, no grey/white halo, gaps cut through.
- [ ] No green fringe on edges.
- [ ] Reads clearly at its on-slide size on dark navy.
