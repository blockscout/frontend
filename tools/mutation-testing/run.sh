#!/bin/bash

# Usage: tools/mutation-testing/run.sh [--changed[=<ref>]] [--base <ref>] [<path>...]

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"

# The tool imports the complexity gate's selection modules, so tsc's rootDir spans both tool
# folders and the entry point lands one level deeper than the outDir.
"$ROOT/node_modules/.bin/tsc" -p "$DIR/tsconfig.json"
node "$DIR/dist/mutation-testing/index.js" "$@"
