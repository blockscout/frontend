#!/bin/bash

# Usage: tools/mutation-testing/run.sh [--changed[=<ref>]] [--base <ref>] [<path>...]

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"

# Compiled into a directory of this run's own: a shared one would be rewritten by a second run while
# Stryker is still loading the reporter plugin out of it for the first. It has to sit inside the repo,
# where the compiled code resolves node_modules; .gitignore and stryker.config.json both name it.
OUT="$(mktemp -d "$DIR/.build.XXXXXX")"
trap 'rm -rf "$OUT"' EXIT

# The tool imports the complexity gate's selection modules, so tsc's rootDir spans both tool
# folders and the entry point lands one level deeper than the outDir.
"$ROOT/node_modules/.bin/tsc" -p "$DIR/tsconfig.json" --outDir "$OUT"
node "$OUT/mutation-testing/index.js" "$@"
