#!/bin/bash

# Usage: tools/code-complexity/run.sh [--base <ref>] [--max-cognitive <n>] [<path>...]

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"

# The tool imports the shared flag parser from ../cli, so tsc's rootDir spans the tools folder and
# the entry point lands one level deeper than the outDir.
"$ROOT/node_modules/.bin/tsc" -p "$DIR/tsconfig.json"
node "$DIR/dist/code-complexity/index.js" "$@"
