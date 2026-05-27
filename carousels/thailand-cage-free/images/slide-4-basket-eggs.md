# Image spec — Slide 4 · "The supermarkets"

**Target file:** `slide-4-basket-eggs.png`
**Used by:** `../index.html`, slide 4 (`9 of 14` supermarkets have no cage-free policy + CTA)
**Role in slide:** Hero subject anchored to the bottom, floating on navy (`#0D1D36`). Pivots the story from the farm to the retail shelf / the shopper's choice — supports the call to action.

---

## ⚠️ Art-direction rule (applies to EVERY image in this carousel)

**Never depict a live animal in farming conditions, and never depict animal suffering.** Animal-free, symbolic objects only. (This basket-and-eggs scene is already animal-free — keep it that way.)

## Output requirements (non-negotiable)

- **Format:** PNG-24 with a real **alpha channel**. Not flattened onto white.
- **Background:** 100% transparent (alpha = 0 except the basket + eggs).
- **No baked-in shadow, ground plane, gradient, or frame.** The slide adds its own glow/shadow.
- **Canvas:** square, **1536 × 1536 px** (1024 min).
- **Composition:** single object group, **bottom-weighted**, centered, ~75% of frame height. This slide carries the most text, so keep the image compact and clean — it shares vertical space with a sub-line and a CTA pill.

## Subject & art direction

A **supermarket shopping basket** (the handheld red or grey plastic kind, or a small wire cart) holding **one open carton of eggs** clearly visible at the top. Optionally a couple of loose grocery items, but keep it simple and legible — the egg carton must read instantly. This is the everyday retail moment where the shopper's choice (and the supermarket's policy) decides the hen's fate.

- **Style:** realistic editorial product photograph; clean soft studio light; neutral, contemporary. Slightly desaturated so it sits against navy.
- **Palette:** keep the carton/eggs natural; if the basket is coloured, mute it so it doesn't fight the brand yellow/navy. A grey or muted-red basket works best.
- **Tone:** neutral and hopeful-actionable (it pairs with the CTA), not grim.
- **No branding:** generic basket and carton — **no real supermarket logos or brand names** on the basket or packaging.

## Prompt (ready to paste)

Subject only — the generator appends the green screen.

> Editorial product photograph of a handheld supermarket shopping basket holding one open carton of pale brown eggs clearly visible at the top, clean soft studio lighting, neutral contemporary tone, slightly desaturated, generic unbranded packaging.

**Negative prompt:**
> background, supermarket aisle, shelves, floor, scene, drop shadow, cast shadow, gradient, vignette, text, brand logo, supermarket name, label text, watermark, hands, people, hen, blood, cartoon, illustration, oversaturated, green spill or green tint on the basket

## Generation (project standard)

`gpt-image-2`, quality `low`, rendered on a flat green screen, then chroma-keyed to transparency — the basket handle openings and weave gaps cut through (alpha, not filled). Run via the **generating-carousel-images** skill:

```bash
.claude/skills/generating-carousel-images/generate_cutout.sh \
  carousels/thailand-cage-free/images/slide-4-basket-eggs.png \
  "<subject prompt>. Do not include: <negatives>, green spill or green tint on the basket." 1024x1024
```
Do not request `background:"transparent"` — gpt-image-2 rejects it.

## Acceptance check

- [ ] Transparent after keying, including gaps in the handle/weave.
- [ ] Egg carton reads instantly; basket compact (leaves room for the slide's text + CTA).
- [ ] No real brand names or logos visible.
- [ ] No green box/halo, no green fringe on edges.
- [ ] Reads clearly at ~460px wide.
