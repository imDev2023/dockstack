#!/usr/bin/env bash
# Build the game's compressed models from their uncompressed exports in
# source/models, then validate them. Meshopt cuts the models by about 65%;
# the page loads them through Three.js's MeshoptDecoder.
set -euo pipefail
cd "$(dirname "$0")"
gt() { npx -y @gltf-transform/cli@4.5.1 "$@"; }
mkdir -p assets/models/kit
for f in source/models/*.glb; do
  gt meshopt "$f" "assets/models/$(basename "$f")" > /dev/null
done
for f in source/models/kit/*.glb; do
  gt meshopt "$f" "assets/models/kit/$(basename "$f")" > /dev/null
done
for f in assets/models/*.glb assets/models/kit/*.glb; do
  out=$(gt validate "$f" 2>&1)
  grep -q "No errors found" <<< "$out" || { echo "invalid: $f"; echo "$out"; exit 1; }
  printf '%-36s %4s KB, valid\n' "$f" "$(du -k "$f" | cut -f1)"
done
