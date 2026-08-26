#!/bin/bash

# Compile-on-run wrapper for the code-complexity gate (tools/code-complexity/index.ts).
# Mirrors tools/dev-server/fetch.sh: compiles with the repo-local TypeScript so it is
# self-contained, then runs the emitted JS. Resolves its own location so it can be called
# from any working directory, but git commands run relative to the current directory.
#
# Usage: tools/code-complexity/run.sh [--base <ref>] [--max-complexity <n>] [<path>...]

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"

"$ROOT/node_modules/.bin/tsc" -p "$DIR/tsconfig.json"
node "$DIR/dist/index.js" "$@"
