# Vietnam broilers carousel

A 4-slide ALA carousel on intensive meat-chicken (broiler) farming in Vietnam,
following one bird's life: scale → short life → engineered growth → accelerating
trend + CTA. Built as a single interactive HTML slider that riffs on
`design_system/` (navy canvas, yellow Lilita One numbers, Poppins body, graph-paper
grid, white logo bottom-left). Each slide is an export-ready `1080 × 1350` (4:5) frame.

## View it

Open `index.html` in a browser. Navigate with the **arrow keys**, the **‹ ›** buttons,
the **dots**, or **swipe** on touch.

## The slides

| # | Number | Beat | Source |
|---|--------|------|--------|
| 1 | **687 million** | chickens slaughtered in Vietnam in 2024 (~22/second) | FAO / FAOSTAT, 2024 |
| 2 | **42 days** | slaughter age vs up to 10-year natural lifespan | The Humane League · industrial-broiler standard |
| 3 | **400% faster** | modern breeds grow 4× faster than 1957 breeds | Zuidhof et al., Poultry Science, 2014 |
| 4 | **+77%** | 389M (2015) → 687M (2024), still climbing + CTA | FAO / FAOSTAT, 2015–2024 |

## Images (transparent PNGs)

Each slide has one image rendered as a **transparent PNG cut-out** floating on the navy
field (the slide supplies its own glow + drop-shadow in CSS, so the PNG must NOT bake in
any background or shadow). Until the PNG exists, a dashed placeholder shows in its place.

| Spec | Output PNG | Concept |
|------|-----------|---------|
| `images/slide-1-chicken.md` | `images/slide-1-chicken.png` | bold flat graphic hen (illustration, not photoreal) |
| `images/slide-2-candle.md` | `images/slide-2-candle.png` | a just-snuffed candle with a curl of smoke (life cut short) |
| `images/slide-3-scale.md` | `images/slide-3-scale.png` | weighing scale, needle pinned high |
| `images/slide-4-chart.md` | `images/slide-4-chart.png` | ascending bar chart |

### Art-direction rule (critical)

**No image may depict a live animal in farming conditions, or any animal suffering.**
Photorealistic AI images of caged or distressed animals can be exposed as AI-generated
and used to discredit the campaign. Imagery is therefore either an **animal-free symbolic
object** (calendar, scale, chart) or a **bold flat graphic illustration** (the slide-1
hen) — never a photorealistic/photographic animal, never in farming conditions, never
suffering. No blood, death, or distress.
