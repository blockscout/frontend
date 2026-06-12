#!/bin/bash

# Compile-on-run wrapper for the env fetcher (tools/dev-server/fetch.ts).
# Resolves its own location, so it can be called from any working directory.
# Writes .env.tmp to the CURRENT working directory (or to the path given via --out=).
#
# Usage: tools/dev-server/fetch.sh <alias> [--omit-local-envs] [--out=<path>]

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

tsc -p "$DIR/tsconfig.json"
node "$DIR/fetch.js" "$@"
