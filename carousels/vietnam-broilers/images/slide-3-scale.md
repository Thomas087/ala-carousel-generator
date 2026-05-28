# Image spec — Slide 3 · "engineered weight"

**Target file:** `slide-3-scale.png`
**Used by:** `../index.html`, slide 3 (`400% faster` — bred for weight)
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

A heavy-duty **mechanical dial weighing scale** (the round-faced platform type), its needle swung hard to the high end of the dial — symbolising weight pushed beyond what a body should bear. Empty platform. Sober, editorial, slightly desaturated brushed metal so it reads on dark navy. Even neutral studio lighting; no scene, no surface. Keep dial markings abstract/unreadable.

## Prompt (ready to paste)

Describe the **subject only** — do **not** mention the background.

> A heavy-duty round-faced mechanical platform weighing scale with its needle swung hard to the far high end of the dial, empty platform, brushed metal, sober editorial product photography, slightly desaturated, even neutral lighting.

**Negative prompt:**
> live animal, hen, chicken, bird, meat, suffering, distress, blood, dead animal, background, room, table surface, scene, drop shadow, cast shadow, gradient, vignette, readable text, numbers, watermark, logo, cartoon, oversaturated, green spill or green tint on the subject

## Generation (project standard)

```bash
.claude/skills/generating-carousel-images/generate_cutout.sh \
  carousels/vietnam-broilers/images/slide-3-scale.png \
  "A heavy-duty round-faced mechanical platform weighing scale with its needle swung hard to the far high end of the dial, empty platform, brushed metal, sober editorial product photography, slightly desaturated, even neutral lighting. Do not include: live animal, bird, meat, background, table surface, scene, drop shadow, gradient, readable text, numbers, watermark, logo, green spill or green tint on the subject." \
  1024x1024
```

## Acceptance check

- [ ] No live animal and no depiction of suffering.
- [ ] Transparent background after keying — no green box, no grey/white halo, gaps cut through.
- [ ] No green fringe on edges.
- [ ] Reads clearly at its on-slide size on dark navy.
