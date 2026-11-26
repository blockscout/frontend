#!/bin/bash

# Compile-on-run wrapper for the check of the built toolkit declarations.
# Resolves its own location, so it can be called from any working directory.
# Build the toolkit package first: the check reads its dist folder.
#
# Usage: tools/toolkit-declarations/run.sh

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"

# Use the repo-local TypeScript so the wrapper is self-contained (no global tsc needed).
"$ROOT/node_modules/.bin/tsc" -p "$DIR/tsconfig.json"
node "$DIR/dist/index.js" "$@"
