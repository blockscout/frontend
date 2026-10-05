#!/bin/bash

# Compile-on-run wrapper for the release tool.
# Resolves its own location, so it can be called from any working directory.
#
# Usage: tools/release/run.sh <subcommand> [args]

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"

# The tool imports the shared helpers from ../cli, so tsc's rootDir spans the tools folder and the entry
# point lands one level deeper than the outDir.
"$ROOT/node_modules/.bin/tsc" -p "$DIR/tsconfig.json"
node "$DIR/dist/release/index.js" "$@"
