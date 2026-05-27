#!/usr/bin/env python3
"""chroma_key.py — key a flat green-screen image to a transparent PNG cut-out.

Usage: chroma_key.py INPUT OUTPUT [--lo N] [--hi N]

Method: greenness = G - max(R, B). Pixels with high greenness are background.
Alpha ramps linearly from opaque at greenness <= --lo to fully transparent at
greenness >= --hi (the ramp gives anti-aliased edges, and cuts the green that
shows *through* gaps — wire mesh, basket weave, between eggs). A despill step
clamps the green channel down to max(R, B) wherever green dominates, so subject
edges don't keep a green fringe.

Defaults (--lo 40 --hi 120) suit a bright, evenly-lit green screen. Raise --lo
if the subject is being eaten; lower --hi if green halos survive.

Requires: numpy, Pillow.
"""
import argparse
import numpy as np
from PIL import Image


def chroma_key(inp: str, out: str, lo: float, hi: float) -> float:
    img = np.asarray(Image.open(inp).convert("RGB")).astype(np.float32)
    r, g, b = img[..., 0], img[..., 1], img[..., 2]
    rb_max = np.maximum(r, b)
    greenness = g - rb_max
    alpha = np.clip((hi - greenness) / (hi - lo), 0.0, 1.0)
    # despill: where the subject picked up green, pull green down to the r/b level
    g_despilled = np.where(greenness > 0, rb_max, g)
    rgba = np.stack([r, g_despilled, b, alpha * 255.0], axis=-1)
    rgba = rgba.clip(0, 255).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(out)
    return float((rgba[..., 3] == 0).mean())


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Key a green screen to transparency.")
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--lo", type=float, default=40.0, help="greenness <= lo stays opaque")
    ap.add_argument("--hi", type=float, default=120.0, help="greenness >= hi is fully transparent")
    a = ap.parse_args()
    frac = chroma_key(a.input, a.output, a.lo, a.hi)
    print(f"{a.output} (transparent {100 * frac:.0f}%)")
