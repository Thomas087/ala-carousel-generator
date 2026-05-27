---
name: exporting-carousel-slider
description: Use when a built ALA carousel slider (carousels/<slug>/index.html) needs static deliverables — a PNG of each slide and/or a single multi-page PDF of the whole slider, e.g. for posting to Instagram or sharing. Triggers: "export the slider to PNG/PDF", "generate PNG and PDF versions of the slider", "render the carousel slides to images", "make a PDF of the carousel".
---

# Exporting a carousel slider to PNG + PDF

## Overview

Turn a built slider (`carousels/<slug>/index.html`, output of building-carousel-slider) into static files: one PNG per slide plus one multi-page PDF. **One command does it — don't hand-roll a new renderer; the proven script already dodges two non-obvious traps (below).**

The tool lives with the other export tooling: `design_system/export-slider.mjs`. It uses only Playwright (already installed in `design_system/node_modules`) — no extra dependencies.

## Quick reference

```bash
# from the repo root
node design_system/export-slider.mjs carousels/<slug>          # default --scale 2
node design_system/export-slider.mjs carousels/<slug> --scale 1
# or: cd design_system && npm run export:slider -- ../carousels/<slug>
```

Writes into `carousels/<slug>/export/`:
- `slide-1.png … slide-N.png` — one per slide
- `<slug>.pdf` — one slide per page

`--scale` is the device pixel ratio. **Default 2 → 2160×2700 PNGs** (crisp, matches the design system; Instagram accepts it and downscales). Use `--scale 1` for exact 1080×1350.

**Generate the slide images first.** Export renders whatever the page shows; if a cut-out PNG is missing the slide exports with its dashed placeholder. Run generating-carousel-images before exporting a final deliverable.

## Why a dedicated script (the two traps)

These are why a naive "just screenshot it / just call page.pdf()" attempt produces broken files — the script already handles both, so don't reinvent it:

1. **The slider scales itself to the window.** A responsive `.scaler` transform shrinks the frame and the `.track` translates so only one slide is on-screen. Screenshot as-is and every slide comes out shrunken and/or clipped. The script resets `#scaler` transform and anchors the frame to a whole-pixel top-left origin, then screenshots each `.slide` element directly (Playwright captures the element's own paint even when a sibling is clipped). It must **not** touch `.track` flex-direction, `.slide` width/height, or `#scaler` height — any of those collapses the slide's inner flex layout and exports come out **blank**.
2. **Chromium's `page.pdf()` destroys image-heavy slides.** Its print path downsamples the embedded cut-out images to a few pixels → a blank/blurry PDF. The script instead embeds full-resolution JPEG screenshots into a hand-built PDF (one slide per page).

## Verify (before claiming done)

Open a couple of the PNGs and the PDF and confirm: each slide is **1080×1350 (×scale)**, shows its number-first headline, image (not the dashed placeholder), logo bottom-left and source bottom-right **un-cropped**, with square corners and no slider chrome (arrows/dots). Check the PDF has one page per slide. Don't trust file existence alone — look at the pixels.

## Common mistakes

| Mistake | Fix |
|---|---|
| Exports come out blank | Don't change `.track`/`.slide`/`#scaler` layout — only reset the scaler transform. Use the script as-is. |
| Slides shrunken or clipped | The `.scaler` transform wasn't reset; screenshot each `.slide`, not a scaled frame. |
| Blank/blurry PDF | Don't use `page.pdf()` for these slides; embed full-res rasters (the script does). |
| PNGs 2162px wide, not 2160 | Frame centred at a fractional x — anchor it to a whole-pixel origin (the script does). |
| Placeholder dashes in the export | Run generating-carousel-images first; the cut-out PNGs were missing. |
| Bare `import 'playwright'` fails | Run the script from `design_system/` (or via the repo-root path above) so `node_modules` resolves. |

## Reference files

- `design_system/export-slider.mjs` — the exporter (Playwright PNG capture + zero-dependency PDF assembly). The canonical, tested tool; edit it rather than writing a parallel script.
