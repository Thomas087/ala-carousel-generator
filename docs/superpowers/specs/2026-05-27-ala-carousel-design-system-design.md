# ALA Carousel — Design System + Templates

**Date:** 2026-05-27
**Status:** Implemented

## Goal

From four reference slides plus the ALA logo, derive a reusable **design system**
and a set of **slide templates** for *Accountability Lens Asia* data-journalism
carousels. Output must be reproducible and programmatic (the repo is a "generator").

## Decisions

- **Tech:** HTML/CSS. One shared stylesheet of tokens + component classes; one
  self-contained HTML file per slide archetype; a styleguide `index.html`.
- **Location:** everything under a dedicated `design_system/` folder.
- **Fonts:** close free Google Fonts (Lilita One display, Poppins body), swappable
  for the real brand fonts later. Anton noted as a more-condensed alternative.
- **Templates:** all four archetypes — `cover`, `big-stat`, `two-stat`, `chart`.
- **Canvas:** `1080 × 1350` (4:5).

## Brand tokens (sampled from references)

| Token | Value | Use |
|---|---|---|
| `--ala-navy` | `#0D1D36` | stage / ink |
| `--ala-yellow` | `#F9CC11` | hero numbers, emphasis |
| `--ala-white` | `#F5F3EC` | supporting text |
| `--ala-olive` | `#67604E` | secondary chart data |
| `--ala-navy-grid` | `#1B2B47` | graph-paper texture |

## Components

`.ala-slide` (stage) · `.ala-grid` (graph paper) · `.ala-logo` (white mark,
bottom-left) · `.ala-headline` (`.line--yellow` / `.line--white`) · `.ala-hero` ·
`.ala-caption` · `.ala-eyebrow` · `.ala-stat` (`__value`/`__sign`/`__unit`/`__caption`) ·
`.ala-donut` (conic-gradient pie + navy `::after` centre hole) · `.ala-legend`.

## Logo

White monochrome mark generated from `assets/ala-logo.png` by luminance-keying
(navy → transparent, yellow → white) into `design_system/assets/ala-logo-white.png`.

## Export

`export.mjs` (Playwright/Chromium) loads each template, waits for fonts, and
screenshots the `.ala-slide` element to a 1080×1350 PNG at 2× scale.

## Verification

All four templates rendered and visually compared against the reference slides;
the two-stat and chart slides closely reproduce their originals. Styleguide page
rendered and checked. Donut hole bug (CSS mask) found and fixed via the
`::after` navy-disk technique.

## Out of scope (YAGNI)

Data-driven templating engine, additional aspect ratios, animated/video export.
