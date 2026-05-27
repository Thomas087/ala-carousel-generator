---
name: building-carousel-slider
description: Use when you have finalized ALA carousel/slider wording (slide copy, stats, sources) and need to generate the interactive HTML slider — one self-contained page with a transparent-PNG image placeholder and an AI-image-generation spec per slide. Triggers: "build the slider HTML", "turn this carousel wording into HTML", "generate the carousel page/slides".
---

# Building an ALA carousel slider

## Overview

Turn finalized slide wording into one self-contained, export-ready HTML slider matching the ALA design system. Each slide is a `1080×1350` (4:5) frame, **number-first**, on flat navy, with one **transparent-PNG image** and a brief source line. Every image is also documented in a `.md` spec so it can be generated later by an AI image API.

Core principle: **the wording is fixed input — your job is faithful layout + safe, animal-free imagery + a working slider, then verify by rendering.**

## ⚠️ The one hard rule: image safety

**No image may depict a live animal in intensive-farming conditions, or any animal suffering.** Use animal-free, symbolic objects only — empty cage, a sheet of A4, eggs, a carton, a shopping basket, packaging, a barn exterior, a chart.

**Why:** a photorealistic AI image of a caged or distressed animal can be exposed as AI-generated and used to discredit the campaign. One debunked image costs more than any emotional punch it bought.

This holds **even when**:
- the wording is about caged or suffering hens — depict the *cage* or the *product*, not a suffering animal;
- a realistic animal would feel "more powerful" — more powerful is also more dangerous if debunked;
- you're only writing the spec, not generating the image — the rule lives in the spec's prompt **and** negative prompt.

A flat, obviously-graphic pictogram/silhouette is acceptable; a realistic or photographic animal is not.

## Workflow

1. **Create the folder** `carousels/<topic-slug>/` with an `images/` subfolder.
2. **Copy the template** `slider-template.html` (this skill) → `carousels/<topic-slug>/index.html`. It already contains the design tokens, slider chrome (arrow keys / buttons / dots / swipe), the viewport-fit logic, the logo lockup, and the placeholder pattern. **Don't re-derive these.**
3. **Fill one slide per wording block.** Lead with the number as the hero (`.stat__num`), the rest as `.caption`; extra lines as `.sub`; a closing call-to-action as `.cta`. Use the `stat--sm` modifier when the headline is long (e.g. `9 of 14`, `620 cm²`).
4. **Choose one animal-free image concept per slide** (see hard rule): scale → the thing at scale; confinement → an empty cage / the A4 sheet; product → eggs / a carton; action → a basket / shelf.
5. **Write one `.md` spec per image** from `image-spec-template.md` into `images/`. Filenames must match each `<img src>` exactly.
6. **Keep each source to one short line**; keep the logo bottom-left (see below).
7. **Verify by rendering** (see Verify) before claiming done.

## Design tokens (match the design system)

| Token | Value | Use |
|---|---|---|
| navy | `#0D1D36` | flat slide background |
| yellow | `#F9CC11` | hero numbers, emphasis |
| warm white | `#F5F3EC` | body text |
| display font | Lilita One | numbers, kickers, CTA |
| body font | Poppins | captions, sources |
| canvas | `1080×1350` | every slide |

Background must be **flat navy**, not a gradient: the ALA logo PNG has a baked navy background that only blends invisibly on flat `#0D1D36`.

## Transparent-PNG integration (the tricky part)

- The PNG is a **cut-out floating on navy**. The slide supplies its own glow + drop-shadow in CSS, so the **PNG must contain no baked background, shadow, gradient, or frame** — say this in every spec.
- Use the **placeholder pattern** so the slider works before any image exists: a dashed `.slot-ph` (label + intended subject + exact filename + "transparent PNG") plus the `<img>` using `onload` to hide the placeholder and `onerror` to hide the broken image.
- Anchor images to the slide's lower edge (`object-fit:contain; object-position:bottom`).

## Logo + sources

- **Logo:** the real ALA brand mark from the repo `assets/ala-logo.png` (path `../../assets/ala-logo.png` from `carousels/<slug>/index.html`), locked **bottom-left**. Never AI-generate it; exclude `logo/text/watermark` in every image negative prompt.
- **Sources:** one short line per slide, bottom-right (e.g. `Source: Sinergia Animal, 2025`). Long sources wrap to a second line and overlap the bottom edge — trim them. Keep sources per-slide so they travel when a slide is reposted alone.

## Image `.md` spec — must include

Copy `image-spec-template.md`; it already encodes the project-standard generation route. Each spec must include:

- Target filename (matches `<img src>`) + which slide / role.
- The **image-safety rule** (animal-free, no suffering).
- Output: a transparent cut-out PNG with real **alpha**, **no baked background/shadow**, bottom-weighted; canvas `1024×1024` (or `1536×1024` / `1024×1536`).
- A paste-ready **subject prompt** (subject only — no background clause) + **negative prompt** (exclude: live/suffering animals, background, shadow, text, logo, watermark, **green spill/tint on the subject**).
- The **generation route**: **`gpt-image-2`, quality `low`, rendered on a green screen, then chroma-keyed** — run via the `generating-carousel-images` skill (`generate_cutout.sh`). Do **not** tell it to request `background:"transparent"` (gpt-image-2 rejects it).
- An **acceptance checklist** (transparent after keying, no green box/halo, no green fringe, reads on dark navy).

**Generating the PNGs is a separate step:** after the slider + specs exist, use the **generating-carousel-images** skill to fill `images/`.

## Verify (before claiming done)

Render the page headless (Playwright / Chromium) and confirm: every slide shows its number-first headline and placeholder; the logo (bottom-left) and source (bottom-right) are fully visible and **not cropped**, including at a short window; nav updates the counter. The only expected console errors are the not-yet-generated PNGs (handled by `onerror`). Delete any throwaway render script afterward.

## Common mistakes

| Mistake | Fix |
|---|---|
| Photoreal hen in a cage / a suffering animal | Animal-free symbolic object; never depict suffering |
| Realistic animal "because it's more powerful" | More powerful = more dangerous if debunked. Don't. |
| PNG with baked shadow/background | Cut-out only; the slide adds the glow + shadow |
| No placeholder → broken slider before images exist | Use the `.slot-ph` + `onload`/`onerror` pattern |
| Long source line wrapping / overlapping the bottom | One short line per slide |
| Gradient background | Flat navy so the logo blends |
| Generic or missing logo, wrong corner | Real `assets/ala-logo.png`, bottom-left |
| Claiming done without rendering | Render; check no crop + placeholders show |

## Reference files

- `slider-template.html` — the slider skeleton (tokens, chrome, fit logic, placeholder pattern, logo, worked example slides). Copy and edit.
- `image-spec-template.md` — the per-image spec to copy into `images/`.
