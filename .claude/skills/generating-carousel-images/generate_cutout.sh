#!/usr/bin/env bash
# generate_cutout.sh — produce one transparent carousel cut-out via
# gpt-image-2 on a green screen, then chroma-key it out.
#
# This is the default pipeline for generating-carousel-images: gpt-image-2
# cannot emit a transparent background (the API rejects background=transparent,
# and asking for transparency in the prompt only paints a fake checkerboard),
# so we render the subject opaque on a flat green screen and key the green out.
#
# Usage:
#   generate_cutout.sh OUTPUT_PATH PROMPT [SIZE]
#
# PROMPT must describe the SUBJECT and fold in its negatives (animal-safety,
# "no green spill on the subject", etc.). Do NOT ask for a transparent
# background in PROMPT — this script appends the green-screen instruction.
# SIZE defaults to 1024x1024 (valid: 1024x1024, 1024x1536, 1536x1024).
#
# Override the model with OPENAI_IMAGE_MODEL (default gpt-image-2). Keying
# thresholds pass through via KEY_LO / KEY_HI. OPENAI_API_KEY is read from the
# environment or the nearest .env (see generate_image.sh).
#
# Exit codes: 0 written · 1 bad args · 2 generation failed.

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[[ $# -lt 2 ]] && { echo "Usage: $0 OUTPUT_PATH PROMPT [SIZE]" >&2; exit 1; }
output="$1"
prompt="$2"
size="${3:-1024x1024}"

GREEN="On a solid flat uniform chroma-key green screen background (pure bright green RGB 0,177,64), evenly lit, no gradient and no shadow on the background; fill the entire surrounding area and any gaps with this solid green."

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT
green="$tmpdir/green.png"

# 1) generate opaque on green via gpt-image-2
OPENAI_IMAGE_MODEL="${OPENAI_IMAGE_MODEL:-gpt-image-2}" \
OPENAI_IMAGE_BACKGROUND=opaque \
"$SCRIPT_DIR/generate_image.sh" "$green" "$prompt $GREEN" "$size" >/dev/null

# 2) key the green out to a transparent PNG.
# Prefer the repo's .venv (created by `npm run setup:python`) so numpy/Pillow
# resolve without polluting system Python; fall back to plain python3 otherwise.
py="python3"
dir="$SCRIPT_DIR"
while [[ "$dir" != "/" ]]; do
  if [[ -x "$dir/.venv/bin/python" ]]; then
    py="$dir/.venv/bin/python"
    break
  fi
  dir="$(dirname "$dir")"
done

mkdir -p "$(dirname "$output")"
"$py" "$SCRIPT_DIR/chroma_key.py" "$green" "$output" \
  --lo "${KEY_LO:-40}" --hi "${KEY_HI:-120}"
