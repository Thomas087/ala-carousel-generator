# Thailand cage-free carousel

A 4-slide ALA carousel on caged-hen egg farming in Thailand, ending on supermarket
accountability. Built as a single interactive HTML slider that riffs on
`design_system/` (navy canvas, yellow Lilita One numbers, Poppins body, graph-paper grid,
white logo bottom-left). Each slide is an export-ready `1080 × 1350` (4:5) frame.

## View it

Open `index.html` in a browser. Navigate with the **arrow keys**, the **‹ ›** buttons,
the **dots**, or **swipe** on touch.

## The slides

| # | Number | Beat | Source |
|---|--------|------|--------|
| 1 | **54 million** | hens in battery cages | Sinergia Animal, 2025 |
| 2 | **620 cm²** | less space than a sheet of A4 | A4 geometry + battery-cage standard |
| 3 | **43 million** | eggs laid every day | Thai DLD / Statista, 2023 |
| 4 | **9 of 14** | supermarkets with no cage-free policy + CTA | Sinergia Animal ranking, 2025 |

## Images (transparent PNGs)

Each slide has one image rendered as a **transparent PNG cut-out** floating on the navy
field (the slide supplies its own glow + drop-shadow in CSS, so the PNG must NOT bake in
any background or shadow). Until the PNG exists, a dashed placeholder shows in its place.

Generate each image from its spec file, then drop the PNG into `images/` with the exact
filename — it will appear automatically:

| Spec | Output PNG | Concept |
|------|-----------|---------|
| `images/slide-1-empty-cage.md` | `images/slide-1-empty-cage.png` | empty battery cage |
| `images/slide-2-a4-space.md` | `images/slide-2-a4-space.png` | A4 sheet + dimensions |
| `images/slide-3-eggs.md` | `images/slide-3-eggs.png` | clean cluster of eggs |
| `images/slide-4-basket-eggs.md` | `images/slide-4-basket-eggs.png` | shopping basket + eggs |

Every spec requires a real alpha channel (PNG-24), no baked-in background/shadow, and a
sober editorial tone.

### Art-direction rule (critical)

**No image may depict a live animal in farming conditions, or any animal suffering.**
Photorealistic AI images of caged or distressed animals can be exposed as AI-generated
and used to discredit the campaign. Every image is therefore an **animal-free, symbolic
object** (empty cage, A4 sheet, eggs, shopping basket). No hens, chicks, or birds; no
blood, death, or distress.
