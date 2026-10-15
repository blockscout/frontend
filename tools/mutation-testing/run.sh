#!/bin/bash

# Usage: tools/mutation-testing/run.sh [--changed[=<ref>]] [--base <ref>] [<path>...]

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"

# The compiled entry point takes the real lock. This check only keeps a second run from rewriting
# dist/ underneath a first one that is still loading the reporter plugin from there; the lock's
# path and shape are set in config.ts.
LOCK="$DIR/.lock"
if [ -e "$LOCK" ]; then
  HOLDER_PID="$(grep -o '"pid":[0-9]*' "$LOCK" | head -1 | cut -d: -f2)"
  if [ -n "$HOLDER_PID" ] && kill -0 "$HOLDER_PID" 2>/dev/null; then
    echo "Another test:mutation-testing run holds this checkout (pid $HOLDER_PID). Wait for it to finish, or run from a separate worktree." >&2
    exit 1
  fi
fi

# The tool imports the complexity gate's selection modules, so tsc's rootDir spans both tool
# folders and the entry point lands one level deeper than the outDir.
"$ROOT/node_modules/.bin/tsc" -p "$DIR/tsconfig.json"
node "$DIR/dist/mutation-testing/index.js" "$@"
