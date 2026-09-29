#!/bin/bash

# Usage: tools/review-screen/run.sh [--scope branch|uncommitted] [--base <ref>] [--spec <path>] [--ticket <NN>] [--calibration]
#        tools/review-screen/run.sh --origins <sidecar> --findings <path|->
#        tools/review-screen/run.sh --report [--json]

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"

# The tool imports the shared flag parser from ../cli and the git plumbing from ../code-complexity, so
# tsc's rootDir spans the tools folder and the entry point lands one level deeper than the outDir.
"$ROOT/node_modules/.bin/tsc" -p "$DIR/tsconfig.json"
node "$DIR/dist/review-screen/index.js" "$@"
