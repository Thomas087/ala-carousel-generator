# Image spec — Slide 3 · "The eggs"

**Target file:** `slide-3-eggs.png`
**Used by:** `../index.html`, slide 3 (`43 million` eggs a day)
**Role in slide:** Hero subject anchored to the bottom, floating on navy (`#0D1D36`). Conveys the scale of egg output as a clean, neutral product still life — **no cage, no animal**.

---

## ⚠️ Art-direction rule (applies to EVERY image in this carousel)

**Never depict a live animal in farming conditions, and never depict animal suffering.** Animal-free, symbolic objects only. (Eggs are fine; do not add cage wire, a hen, or any farm/suffering cue.)

## Output requirements (non-negotiable)

- **Format:** PNG-24 with a real **alpha channel**. Not flattened onto white.
- **Background:** 100% transparent (alpha = 0 except the eggs).
- **No baked-in shadow, ground plane, gradient, or frame.** The slide adds its own glow/shadow.
- **Canvas:** square, **1536 × 1536 px**, or landscape **1536 × 1024** for the wide cluster.
- **Composition:** a wide, low cluster of eggs spanning most of the frame width, **bottom-weighted**, centered. Front eggs sharp, back eggs softer for depth — the whole mass on transparency.

## Subject & art direction

A clean **cluster of pale brown / cream chicken eggs** — a believable group of ~15–30 eggs gently piled, as a neutral studio still life. **No cage wire, no carton, no nest, no farm context** — just the eggs, suggesting volume/scale. Calm, factual, contemporary.

- **Style:** clean editorial product photography; soft daylight; gentle specular highlights on the shells so they read against a dark background.
- **Palette:** natural egg tones (cream, pale brown), slightly desaturated to sit against navy. Keep highlights so the eggs don't vanish into the dark slide.
- **Tone:** neutral "scale of production" beat — not shock, not farm grime.

## Prompt (ready to paste)

Subject only — the generator appends the green screen.

> Clean editorial product photograph of a gently piled cluster of about twenty-five pale brown and cream chicken eggs, neutral studio still life, soft daylight with gentle highlights on the shells, shallow depth of field with front eggs sharp, sober factual tone, no packaging and no other objects.

**Negative prompt:**
> cage, wire, mesh, carton, basket, nest, hen, chicken, bird, animal, feathers, farm, blood, cracked eggs, background, table, scene, drop shadow, cast shadow, gradient, vignette, text, watermark, logo, cartoon, illustration, oversaturated, single egg, green spill or green tint on the eggs

## Generation (project standard)

`gpt-image-2`, quality `low`, rendered on a flat green screen, then chroma-keyed to transparency — gaps between eggs cut through (alpha, not a grey smear). This is a **landscape** subject, so use `1536x1024`. Run via the **generating-carousel-images** skill:

```bash
.claude/skills/generating-carousel-images/generate_cutout.sh \
  carousels/thailand-cage-free/images/slide-3-eggs.png \
  "<subject prompt>. Do not include: <negatives>, green spill or green tint on the eggs." 1536x1024
```
Do not request `background:"transparent"` — gpt-image-2 rejects it.

## Acceptance check

- [ ] Eggs only — no cage, wire, carton, hen, or farm cue.
- [ ] Transparent after keying; eggs keep enough highlight to be visible on dark navy.
- [ ] No green box/halo, no green fringe on the shells.
- [ ] Reads as "a lot of eggs" (volume/scale).
- [ ] Reads clearly at ~560px wide.
