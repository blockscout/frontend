#!/bin/bash

# Usage: tools/playwright/run.sh [--changed[=<ref>]] [--base <ref>] [--docker] [--docker-deps] [<playwright args>...]

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"

# The tool imports the shared flag parser from ../cli, so tsc's rootDir spans the tools folder and
# the entry point lands one level deeper than the outDir.
"$ROOT/node_modules/.bin/tsc" -p "$DIR/tsconfig.json"
node "$DIR/dist/playwright/index.js" "$@"
