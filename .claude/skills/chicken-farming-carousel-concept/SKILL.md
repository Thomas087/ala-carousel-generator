---
name: chicken-farming-carousel-concept
description: Use when the user wants the concept/idea/wording for an Instagram carousel or slider of statistics about intensive chicken, hen, broiler, layer or poultry farming for a specific country (e.g. "come up with a carousel about chicken farming in X", "draft a slider concept on egg-farming stats"). Produces ALA-style slide copy only — NOT the built carousel, design, or HTML.
---

# Chicken Farming Carousel Concept

## Overview

Produces the **concept and wording** for a 3–5 slide Instagram carousel exposing intensive chicken/hen farming in one country, for ALA (Accountability Lens Asia). Output is the slide copy/idea only — **not** the built carousel: no HTML, no design, no images. Hand the finished wording to the `design_system/` templates as a separate step.

Core principle: **every slide opens with a striking, individually-counted number from a verifiable source, and the whole carousel tells one coherent story.**

## Workflow

Follow these eight steps in order. Steps marked **[ASK]** require the user; steps marked **[AUTO]** run without asking for validation.

1. **[ASK] Get the country.** Ask which country the carousel is about. Ask nothing else yet.
2. **[AUTO] Collect already-used stats.** Scan every existing carousel in `carousels/*/` and compile the stats they already use, so this carousel doesn't repeat them (see *Already-used stats*). Build a do-not-reuse list before researching.
3. **[AUTO] Research stats.** Find verified statistics about intensive chicken/hen farming in that country (see *Sourcing rules*), **excluding anything on the do-not-reuse list**. Aim for ~15–20 candidate stats across sub-topics.
4. **[ASK] Display stats, get the anchor.** Present the verified, not-already-used stats (with sources). If a strong candidate was dropped because a prior carousel already used it, note that in one line. Ask the user to pick **one** stat to build the carousel around. The rest of your research stays available for supporting slides.
5. **[AUTO] Build the 3–5 slide concept.** Build the slider around the anchor stat, using other researched stats **only if they closely relate** and form one narrative (see *Slide rules*). Do not ask for validation.
6. **[AUTO] Self-check numbers + metaphors.** Verify each slide opens with a striking number, that no stat repeats one on the do-not-reuse list, and that any metaphor is clear, accurate, and non-objectifying (see *Metaphor rules*). Fix silently.
7. **[AUTO] Tighten the language.** Proofread: cut editorializing and adjectives, keep declarative sentences, lead with the fact. Do not ask for validation.
8. **[ASK] Present** the finalized slider wording.

## Already-used stats (Step 2)

Find out what's already been published so this carousel brings fresh numbers — don't rebuild a carousel that already exists.

- **Where to look:** every `carousels/*/` folder. For each, read its `README.md` "slides" table if present (the `# · Number · Beat · Source` rows); otherwise read the slide text in `index.html` — the `.stat__num` + `.stat__unit` headline and its `.caption`. Dispatch parallel agents if there are many carousels.
- **What to record:** for each used stat, the number, what it measures, and the country/topic — e.g. `54 million hens in battery cages (Thailand)`, `620 cm² cage space / A4-sheet metaphor (Thailand)`, `9 of 14 supermarkets with no cage-free policy (Thailand)`.
- **What counts as reuse (drop it):** the **same metric for the same country/topic** as an existing carousel (another "X million caged hens in Thailand"), or that carousel's **signature metaphor** reused for the same country (the A4-sheet space comparison again). A *different* country's version of the same metric is fine — it's a genuinely different number.
- **Result:** a do-not-reuse list that Step 3 researches around and Step 6 checks against. If everything strong for this country is already used, find a fresh angle (a different sub-topic, year, or framing) rather than repeating a published stat.

## Sourcing rules (Step 3)

For **each** stat, record: the number, the source organisation, a working URL, the year, and a one-line confidence note.

- **Count individual animals, never tonnage.** Reject "X tonnes of poultry/meat" framing — it objectifies animals as product. Convert to or find per-individual counts ("X million chickens slaughtered").
- **Prefer reputable sources:** FAO / FAOSTAT, Our World in Data, World Bank, OECD-FAO Agricultural Outlook, USDA FAS GAIN, the country's national statistics office, peer-reviewed journals (PubMed/PMC), World Animal Protection, Open Wing Alliance, Sinergia Animal, Humane World/Humane League.
- **Cross-check** headline numbers across sources. **Flag** anything you cannot verify and **do not use it.**
- **Note Vietnam-style scope traps:** a regional ("Asia") or global figure is fine as *context* but must be labelled as such — never present it as a country-specific number.
- **Efficiency:** dispatch parallel research agents across sub-topics — *layer hens*, *broilers/meat birds*, *welfare/disease/antibiotics*, *industry scale/growth* — then merge. See superpowers:dispatching-parallel-agents.

## Slide rules (Step 5)

- **3–5 slides**, one clear idea each.
- **No stat already used in an existing carousel** (see Step 2's do-not-reuse list).
- **Lead every slide with the core number** as the headline — a number, not a word or a metaphor.
- **One coherent story.** Pick stats that fit a single arc (e.g. one bird's life: *scale → confinement → growth/age → mortality → consequence*). Don't mix a layer-hen arc and a broiler arc unless you frame them as one story; drop the strongest stray stat rather than break coherence.
- **Never repeat a stat.** The only exception: restating one stat as an equivalent/metaphor on the same slide.
- **End on consequence + CTA** (why it matters beyond the animals; a follow prompt).
- **Add a small source attribution line** under each slide.

## Metaphor rules (Step 6)

Use a metaphor **only when a raw number is hard to grasp** — at most one per slide.

- **Allowed:** comparisons of **space, time, scale, or proportion** — things done *to* or taken *from* the animals.
  - Space: cage/floor area vs a sheet of A4 paper (~625 cm²).
  - Scale: per-second or per-person rates.
  - Time/age: slaughter age vs natural lifespan, scaled to a human age.
- **Forbidden:** objectifying/commodity comparisons that reduce a living animal to a product or thing (e.g. "weighs as much as X bags of sugar," "as many as X soda cans"). These degrade the animals.
- **Be arithmetically honest:** every metaphor must be accurate and conservative. Do the math before writing it.

## Example (finished slide)

> # 687 million
> **chickens were slaughtered in Vietnam in 2024 — about 22 every second.**
>
> The number rises every year.
>
> <sub>Source: Our World in Data / UN FAOSTAT, 2024</sub>

Number-first headline · individual-bird count · honest scale metaphor ("22 every second") · short source line.

## Common mistakes

| Mistake | Fix |
|---|---|
| Leading a slide with a sentence or metaphor | Lead with the number, every time |
| Tonnage / "meat" framing | Count individual birds |
| Mixing unrelated stats | Keep one narrative; drop strays |
| Objectifying metaphor (bags of sugar, cans) | Compare space/time/scale/proportion only |
| Using an unverifiable or region-wide number as country-specific | Verify + label scope, or drop it |
| Reusing a stat already used in another carousel | Collect used stats first (Step 2); research around the do-not-reuse list |
| Asking the user to validate the autonomous steps | Steps 2–3 and 5–7 are autonomous |
