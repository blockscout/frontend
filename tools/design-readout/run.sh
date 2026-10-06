#!/bin/bash

# Usage: tools/design-readout/run.sh <figma node URL> [--regions <ids>] [--dump <path>]

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"

# The tool imports the shared flag parser from ../cli and the theme defaults from ../../src, so tsc's
# rootDir is the repo root and the entry point lands two levels deeper than the outDir.
"$ROOT/node_modules/.bin/tsc" -p "$DIR/tsconfig.json"
node "$DIR/dist/tools/design-readout/index.js" "$@"
