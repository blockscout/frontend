#!/bin/bash

# Builds the app for production with a preset's config, then runs the smoke set against it.
#
# Usage: pnpm test:smoke [<instance_alias>] [--skip-build] [<playwright args>...]
#
#   <instance_alias>  The preset from tools/dev-server/registry.json; only as the first argument. Default: staging.
#   --skip-build      Run against the app the last build left in .next, such as one built by
#                     `pnpm prod:preset <instance_alias> --build-only`.

set -e

preset="staging"
skip_build=false
playwright_args=()

# `pnpm test:smoke -- <args>` forwards the separator into the script; drop it
if [ "$1" = "--" ]; then
  shift
fi

if [ "$#" -gt 0 ] && [[ "$1" != -* ]]; then
  preset="$1"; shift
fi

while [ "$#" -gt 0 ]; do
  case "$1" in
    --skip-build)
      skip_build=true; shift ;;
    *)
      playwright_args+=( "$1" ); shift ;;
  esac
done

if [ "$skip_build" = false ]; then
  ./tools/dev-server/prod.preset.sh "$preset" --build-only
fi

SMOKE_PRESET="$preset" playwright test --config ./tools/smoke/playwright.config.ts "${playwright_args[@]}"
