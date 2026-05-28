# Image spec — Slide 1 · "scale"

**Target file:** `slide-1-chicken.png`
**Used by:** `../index.html`, slide 1 (`687 million` — chickens slaughtered in Vietnam in 2024)
**Role in slide:** Single hero subject anchored to the bottom of the slide, floating on the navy (`#0D1D36`) background as a clean cut-out — **no background, no scene box**.

---

## ⚠️ Art-direction rule (applies to EVERY image in this carousel)

**Never depict a live animal in farming conditions, and never depict animal suffering.**
This slide shows a chicken, so it MUST be a **bold, obviously-graphic flat illustration / silhouette** — clearly not a photo, NOT in a cage or farm setting, NOT distressed. A flat, obviously-graphic pictogram is acceptable; a realistic or photographic animal is **not** (it can be exposed as AI-generated and used to discredit the campaign). No blood, death, or distress.

## How to generate (consistent across this project)

Generate with **`gpt-image-2`**, **quality `low`**, rendered **opaque on a flat green screen**, then **chroma-key** the green out to transparency. The `generating-carousel-images` skill does both steps via `generate_cutout.sh`.

## Output requirements (non-negotiable)

- **Final asset:** PNG-24 with a real **alpha channel** — the subject as a clean cut-out, 100% transparent everywhere else.
- **No baked-in shadow, gradient, vignette, ground plane, or frame.** The slide adds its own drop-shadow and glow in CSS.
- **Canvas:** **1024 × 1024** (default).
- **Composition:** subject centered horizontally, ~80% of frame height, **bottom-weighted**, with a little padding.

## Subject & art direction

A single standing hen rendered as a **bold flat vector illustration** — clean geometric shapes, thick confident outlines, a limited palette of warm yellow (`#F9CC11`) and cream with a little charcoal for definition. Obviously a graphic illustration, **not** a photograph. The hen stands calmly in profile, healthy and upright — no cage, no wire, no farm scene, no distress. Sober, editorial, reads clearly against dark navy.

## Prompt (ready to paste)

Describe the **subject only** — do **not** mention the background.

> A single standing hen as a bold flat vector illustration, clean geometric shapes and thick confident outlines, limited palette of warm yellow and cream with charcoal accents, calm healthy bird in profile, modern editorial graphic style, obviously an illustration not a photo, even flat lighting.

**Negative prompt:**
> photorealistic, photograph, realistic feathers, 3d render, cage, wire, farm, barn, suffering, distress, blood, gore, dead animal, background, floor, scene, drop shadow, cast shadow, gradient, vignette, text, watermark, logo, oversaturated, green spill or green tint on the subject

## Generation (project standard)

```bash
.claude/skills/generating-carousel-images/generate_cutout.sh \
  carousels/vietnam-broilers/images/slide-1-chicken.png \
  "A single standing hen as a bold flat vector illustration, clean geometric shapes and thick confident outlines, limited palette of warm yellow and cream with charcoal accents, calm healthy bird in profile, modern editorial graphic style, obviously an illustration not a photo, even flat lighting. Do not include: photorealistic, photograph, 3d render, cage, wire, farm, suffering, distress, blood, background, floor, scene, drop shadow, gradient, text, watermark, logo, green spill or green tint on the subject." \
  1024x1024
```

## Acceptance check

- [ ] A flat GRAPHIC chicken — obviously an illustration, never a photoreal/photographic animal.
- [ ] No cage, no farm scene, no suffering.
- [ ] Transparent background after keying — no green box, no grey/white halo.
- [ ] No green fringe on edges.
- [ ] Reads clearly at its on-slide size on dark navy.
