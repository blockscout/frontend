#!/bin/bash

# Production build + start against a live instance's config (same env layering as dev.preset.sh).
# Useful for performance measurements, where dev-mode overhead (React dev build, Turbopack
# on-demand compile, StrictMode double-fetch) would skew the numbers.
# The shared steps live in run_steps.sh.
#
# Builds with Turbopack (the Next.js default), like the shipped image does — see
# .agents/adr/0003-turbopack-for-production-builds.md.
#
# Usage: pnpm prod:preset <instance_alias> [--port <number>] [--skip-build] [--profile]
#
#   --skip-build  Start the server from the existing build (.next) without rebuilding.
#                 Reuses the .env.tmp and public assets produced by the previous full run.
#   --profile     Build a React-profileable production bundle (`next build --webpack --profile`).
#                 Why profiling stays on webpack, and what it's good for: tools/profiling/CONTEXT.md.

source ./tools/dev-server/run_steps.sh

usage="Usage: pnpm prod:preset <instance_alias> [--port <number>] [--skip-build] [--profile]"

port=""
skip_build=false
profile=false
positional=()
while [ "$#" -gt 0 ]; do
  case "$1" in
    --port)
      if [ "$#" -lt 2 ]; then
        echo "🚨 --port requires a value."
        echo "$usage"
        exit 1
      fi
      port="$2"; shift 2 ;;
    --port=*)
      port="${1#--port=}"; shift ;;
    --skip-build)
      skip_build=true; shift ;;
    --profile)
      profile=true; shift ;;
    --)
      # `pnpm prod:preset -- eth` forwards the separator into the script; drop it
      shift ;;
    *)
      positional+=( "$1" ); shift ;;
  esac
done

if [ "${#positional[@]}" -ne 1 ]; then
  echo "$usage"
  exit 1
fi

preset_name="${positional[0]}"

# the command the user actually typed, for error hints
cmd="pnpm prod:preset $preset_name"
build_flags=""
if [ "$profile" = true ]; then
  cmd="$cmd --profile"
  build_flags=" --webpack --profile"
fi

build_port_args "$port" "$usage"
build_env_args ./.env.tmp

if [ "$skip_build" = false ]; then
  # Fetch the instance config into ./.env.tmp (compile-on-run)
  ./tools/dev-server/fetch.sh "$preset_name" || exit 1

  prepare_assets "$preset_name"

  # build the app
  run_with_envs "source ./deploy/scripts/export_pro_api_flag.sh && next build${build_flags}" || exit 1
  echo ""
else
  if [ ! -f ./.env.tmp ]; then
    echo "Error: .env.tmp not found. Run a full build first: $cmd"
    exit 1
  fi
  if [ ! -d ./.next ]; then
    echo "Error: .next build output not found. Run a full build first: $cmd"
    exit 1
  fi

  # derive the sprite hash from the built sprite file, so the server env matches the build
  # (skipping the build also skips the export from build_sprite.sh)
  if [ -z "$NEXT_PUBLIC_ICON_SPRITE_HASH" ]; then
    sprite_file=$(ls ./public/icons/sprite.*.svg 2>/dev/null | head -1)
    if [ -n "$sprite_file" ]; then
      NEXT_PUBLIC_ICON_SPRITE_HASH=$(basename "$sprite_file" | sed -E 's/^sprite\.(.+)\.svg$/\1/')
    fi
  fi
fi

# generate envs.js and start the production server. Both steps belong here rather than in the
# build: envs.js is read by the browser at runtime, so regenerating it now is what lets a
# --skip-build run pick up a different --port, and the server itself reads the pro-api flag.
run_with_envs 'source ./deploy/scripts/export_pro_api_flag.sh && ./deploy/scripts/make_envs_script.sh && next start -p $NEXT_PUBLIC_APP_PORT' |
pino-pretty
