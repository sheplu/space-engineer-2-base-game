#!/usr/bin/env bash
# Optimize PNGs under assets/ in place: lossy palette quantization via pngquant,
# then lossless compression via oxipng. Safe to re-run; files already under
# quantized size are skipped by pngquant.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET_DIR="${1:-$ROOT/assets}"

command -v pngquant >/dev/null || { echo "pngquant not found (brew install pngquant)" >&2; exit 1; }
command -v oxipng >/dev/null || { echo "oxipng not found (brew install oxipng)" >&2; exit 1; }

before=$(du -sk "$TARGET_DIR" | awk '{print $1}')

while IFS= read -r -d '' f; do
  echo "• $f"
  pngquant --quality=80-95 --skip-if-larger --strip --ext .png --force "$f" || true
  oxipng -o max --strip safe "$f"
done < <(find "$TARGET_DIR" -type f -name '*.png' -print0)

after=$(du -sk "$TARGET_DIR" | awk '{print $1}')
saved=$((before - after))
pct=$(awk -v b="$before" -v a="$after" 'BEGIN{ if (b==0) print 0; else printf "%.1f", (b-a)*100/b }')
printf '\n%s KB -> %s KB (saved %s KB, %s%%)\n' "$before" "$after" "$saved" "$pct"
