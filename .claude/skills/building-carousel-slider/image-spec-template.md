# Image spec — Slide N · "<beat name>"

<!-- Copy this file into carousels/<slug>/images/<filename>.md, one per image.
     Fill every <…>. The filename MUST match the slide's <img src>. -->

**Target file:** `<filename>.png`
**Used by:** `../index.html`, slide N (`<the number>` — <one-line topic>)
**Role in slide:** Single hero subject anchored to the bottom of the slide, floating on the navy (`#0D1D36`) background as a clean cut-out — **no background, no scene box**.

---

## ⚠️ Art-direction rule (applies to EVERY image in this carousel)

**Never depict a live animal in farming conditions, and never depict animal suffering.**
Photorealistic AI images of caged or distressed animals can be exposed as AI-generated and used to discredit the campaign. Use **animal-free, symbolic objects only** (empty cage, A4 sheet, eggs, carton, basket, packaging, barn exterior, chart). A flat, obviously-graphic pictogram is acceptable; a realistic or photographic animal is not. No blood, death, or distress.

## How to generate (consistent across this project)

Generate with **`gpt-image-2`**, **quality `low`**, rendered **opaque on a flat green screen**, then **chroma-key** the green out to transparency. gpt-image-2 cannot emit a transparent background directly, so the green screen + key is the project-standard route. The `generating-carousel-images` skill does both steps via `generate_cutout.sh`.

## Output requirements (non-negotiable)

- **Final asset:** PNG-24 with a real **alpha channel** — the subject as a clean cut-out, 100% transparent everywhere else (achieved by keying out the green screen).
- **No baked-in shadow, gradient, vignette, ground plane, or frame.** The slide adds its own drop-shadow and glow in CSS.
- **Canvas:** square **1024 × 1024** (default). Use **1536 × 1024** (landscape) or **1024 × 1536** (portrait) for wide/tall subjects — these are the valid gpt-image-2 sizes.
- **Composition:** subject centered horizontally, ~80% of frame height, **bottom-weighted** (the slide anchors it to its lower edge), with a little padding.

## Subject & art direction

<Describe the specific animal-free object: what it is, materials, angle, lighting, mood.
 Keep it sober and editorial. Slightly desaturated so it reads on dark navy. State that
 it must read clearly against a dark background.>

## Prompt (ready to paste)

Describe the **subject only** — do **not** mention the background. The generator appends the green-screen instruction, so a "transparent background" clause here would fight it.

> <One vivid sentence describing the object, style, and lighting.>

**Negative prompt:**
> live animal, hen, chicken, bird, suffering, distress, blood, gore, dead animal, background, room, floor, scene, drop shadow, cast shadow, gradient, vignette, text, watermark, logo, cartoon, oversaturated, green spill or green tint on the subject

## Generation (project standard)

Use the `generating-carousel-images` skill:

```bash
.claude/skills/generating-carousel-images/generate_cutout.sh \
  carousels/<slug>/images/<filename>.png "<subject prompt>. Do not include: <negatives>, green spill or green tint on the subject." \
  [1024x1024 | 1536x1024 | 1024x1536]
```

It renders the subject opaque on a flat green screen with **gpt-image-2 at quality low**, then chroma-keys (with despill) to a transparent PNG. Under the hood that is `POST /v1/images/generations` with `{model:"gpt-image-2", quality:"low", background:"opaque", output_format:"png"}`. Do **not** request `background:"transparent"` — gpt-image-2 rejects it.

## Acceptance check

- [ ] No live animal and no depiction of suffering.
- [ ] Transparent background after keying — no green box, no grey/white halo, gaps cut through.
- [ ] No green fringe on edges (despill handled it; tune `KEY_LO`/`KEY_HI` if not).
- [ ] Reads clearly at its on-slide size (~500px wide) on dark navy.
