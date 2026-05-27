#!/usr/bin/env bash
# generate_image.sh — generate one carousel image via the OpenAI gpt-image
# (ChatGPT Image 2) API and save it as a transparent PNG.
#
# Usage:
#   generate_image.sh [--ref PATH]... OUTPUT_PATH PROMPT [SIZE]
#
# Without --ref it calls POST /v1/images/generations (text-to-image).
# With one or more `--ref PATH` flags it calls POST /v1/images/edits, attaching
# each PATH as a multipart `image[]` reference image.
#
# Defaults (override via env):
#   OPENAI_IMAGE_MODEL=gpt-image-1.5   model id (falls back to gpt-image-1 if gated)
#   OPENAI_IMAGE_QUALITY=low           low|medium|high|auto
#   OPENAI_IMAGE_BACKGROUND=transparent  transparent|opaque|auto
#   SIZE (3rd arg) = 1024x1024         valid: 1024x1024, 1024x1536, 1536x1024, auto
#
# NOTE: gpt-image-2 does NOT support transparent backgrounds; this carousel needs
# transparent cut-outs, so the default is gpt-image-1.5 (gpt-image-1 also works).
#
# Output is always PNG (output_format=png) so the transparent alpha survives.
# NOTE: the OpenAI image API has NO negative_prompt field. The caller must fold
# any negatives into PROMPT (e.g. "... Do not include: hen, background, shadow.").
#
# OPENAI_API_KEY is read from the environment; if unset, the nearest .env found
# by walking up from the current directory is sourced automatically.
#
# Exit codes: 0 written · 1 bad args / no key · 2 API call failed.

set -euo pipefail

usage() {
  echo "Usage: $0 [--ref PATH]... OUTPUT_PATH PROMPT [SIZE]" >&2
  exit 1
}

refs=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --ref) [[ $# -ge 2 ]] || usage; refs+=("$2"); shift 2 ;;
    --)    shift; break ;;
    -h|--help) usage ;;
    *)     break ;;
  esac
done

[[ $# -lt 2 ]] && usage

output="$1"
prompt="$2"
size="${3:-1024x1024}"

# Load OPENAI_API_KEY from the nearest .env if it isn't already set.
if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  dir="$PWD"
  while [[ "$dir" != "/" ]]; do
    if [[ -f "$dir/.env" ]]; then
      set -a; # shellcheck disable=SC1090
      source "$dir/.env"; set +a
      break
    fi
    dir="$(dirname "$dir")"
  done
fi
if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "generate_image.sh: OPENAI_API_KEY not set (and no .env found)" >&2
  exit 1
fi

for r in "${refs[@]:-}"; do
  [[ -z "$r" ]] && continue
  [[ -f "$r" ]] || { echo "generate_image.sh: reference not found: $r" >&2; exit 1; }
done

mkdir -p "$(dirname "$output")"

model="${OPENAI_IMAGE_MODEL:-gpt-image-1.5}"
quality="${OPENAI_IMAGE_QUALITY:-low}"
background="${OPENAI_IMAGE_BACKGROUND:-transparent}"

tmp_body="$(mktemp)"
trap 'rm -f "$tmp_body"' EXIT

call_generations() {
  local payload
  payload="$(jq -n \
    --arg model "$1" --arg prompt "$prompt" --arg size "$size" \
    --arg quality "$quality" --arg background "$background" \
    '{model:$model, prompt:$prompt, size:$size, quality:$quality,
      background:$background, output_format:"png", n:1}')"
  curl -sS -o "$tmp_body" -w '%{http_code}' \
    https://api.openai.com/v1/images/generations \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$payload"
}

call_edits() {
  local -a args=(
    -sS -o "$tmp_body" -w '%{http_code}'
    https://api.openai.com/v1/images/edits
    -H "Authorization: Bearer $OPENAI_API_KEY"
    -F "model=$1" -F "prompt=$prompt" -F "size=$size"
    -F "quality=$quality" -F "background=$background"
    -F "output_format=png" -F "n=1"
  )
  local r; for r in "${refs[@]}"; do args+=( -F "image[]=@$r" ); done
  curl "${args[@]}"
}

call_api() {
  if (( ${#refs[@]} > 0 )); then call_edits "$1"; else call_generations "$1"; fi
}

http_code="$(call_api "$model")" || { echo "generate_image.sh: curl failed" >&2; cat "$tmp_body" >&2; exit 2; }

# Fall back to gpt-image-1 (transparency-capable, widely available) when the
# chosen model is gated (403 "must be verified"), unavailable on the account
# (404/400 model not found), or rejects transparent backgrounds (e.g. gpt-image-2).
if [[ "$model" != "gpt-image-1" && ( "$http_code" == "403" || "$http_code" == "404" || "$http_code" == "400" ) ]] && \
   grep -Eqi "must be verified|model.*not.*(found|exist)|does not exist|unknown model|background is not supported" "$tmp_body"; then
  echo "generate_image.sh: $model unavailable/unsuitable on this org; falling back to gpt-image-1" >&2
  model="gpt-image-1"
  http_code="$(call_api "$model")" || { cat "$tmp_body" >&2; exit 2; }
fi

if [[ "$http_code" != "200" ]]; then
  echo "generate_image.sh: HTTP $http_code (model=$model)" >&2
  cat "$tmp_body" >&2
  exit 2
fi

b64="$(jq -r '.data[0].b64_json // empty' "$tmp_body")"
if [[ -n "$b64" ]]; then
  echo "$b64" | base64 -d > "$output"
else
  url="$(jq -r '.data[0].url // empty' "$tmp_body")"
  if [[ -n "$url" ]]; then
    curl -sSL "$url" -o "$output"
  else
    echo "generate_image.sh: no b64_json or url in response" >&2
    cat "$tmp_body" >&2
    exit 2
  fi
fi

echo "$output"
