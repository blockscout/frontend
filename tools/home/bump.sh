#!/bin/bash

# Moves the pin of the home repo (blockscout/frontend-home) to another commit and reinstalls.
# The pin is written twice, in package.json and in the build allowlist of pnpm-workspace.yaml
# (see CONTEXT.md), and the two must name the same commit.
#
# Usage: tools/home/bump.sh [<commit-or-ref>]
#   <commit-or-ref>   a full commit sha, or a branch or tag of the home repo; default: main

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
REPO="blockscout/frontend-home"
TARGET="${1:-main}"

if [[ "$TARGET" =~ ^[0-9a-f]{40}$ ]]; then
  NEXT="$TARGET"
else
  # pnpm wants the exact commit in the allowlist, so a ref is resolved here and never written.
  NEXT="$(git ls-remote "https://github.com/$REPO.git" "$TARGET" | head -n 1 | cut -f 1)"
  if [ -z "$NEXT" ]; then
    echo "bump: '$TARGET' is neither a full commit sha nor a branch or tag of $REPO" >&2
    exit 1
  fi
fi

cd "$ROOT"

CURRENT="$(sed -n "s|.*\"github:$REPO#\([0-9a-f]\{40\}\)\".*|\1|p" package.json)"
if [ -z "$CURRENT" ]; then
  echo "bump: no github:$REPO#<sha> dependency in package.json" >&2
  exit 1
fi

if [ "$CURRENT" = "$NEXT" ]; then
  echo "bump: already pinned at $NEXT"
  exit 0
fi

if ! grep -q "$REPO/tar.gz/$CURRENT" pnpm-workspace.yaml; then
  echo "bump: pnpm-workspace.yaml does not allow the build of $CURRENT; the two pins have drifted" >&2
  exit 1
fi

CURRENT="$CURRENT" NEXT="$NEXT" REPO="$REPO" node -e '
  const fs = require("node:fs");
  const { CURRENT, NEXT, REPO } = process.env;
  const edits = {
    "package.json": `github:${ REPO }#`,
    "pnpm-workspace.yaml": `${ REPO }/tar.gz/`,
  };
  for (const [ file, prefix ] of Object.entries(edits)) {
    fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace(prefix + CURRENT, prefix + NEXT));
  }
'

echo "bump: $CURRENT -> $NEXT"
pnpm install
