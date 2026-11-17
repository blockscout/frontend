#!/bin/bash

# Usage: tools/react-doctor/run.sh [react-doctor options] [<path>...]
#        tools/react-doctor/run.sh why <file>:<line>
#   --scope changed --base origin/main   only issues this branch introduces (what CI runs)
#   --staged                             only staged files

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
BIN="$DIR/node_modules/.bin/react-doctor"

# The tool lives in its own pnpm project (see CONTEXT.md), so the root install does not cover it.
pnpm --dir "$DIR" install --frozen-lockfile --silent

cd "$ROOT"

# Subcommands take their own arguments; only a scan gets a target and the scan flags.
if [ "$1" = "why" ] || [ "$1" = "rules" ]; then
  exec "$BIN" "$@"
fi

# Scan the whole project unless the caller named files.
TARGET=(.)
for arg in "$@"; do
  if [ -e "$arg" ]; then TARGET=(); fi
done

"$BIN" "${TARGET[@]}" --yes --no-telemetry "$@"
