#!/bin/bash

# Production build + start against a live instance's config (same env layering as dev.preset.sh).
# Useful for performance measurements, where dev-mode overhead (React dev build, Turbopack
# on-demand compile, StrictMode double-fetch) would skew the numbers.
#
# Usage: pnpm prod:preset <instance_alias> [--skip-build] [--profile]
#
#   --skip-build  Start the server from the existing build (.next) without rebuilding.
#                 Reuses the .env.tmp and public assets produced by the previous full run.
#   --profile     Build a React-profileable production bundle (`next build --webpack --profile`):
#                 --profile aliases react-dom to react-dom/profiling, so the React DevTools
#                   Profiler works against an otherwise production build (minified, prod JSX
#                   runtime, no dev-only checks);
#                 --webpack because --profile is guaranteed on the webpack pipeline, while
#                   Turbopack's (the Next 16 default) production profiling support is not
#                   documented; next.config.js maintains both pipelines.
#                 NOTE: most component names in this build are minified — use it to SIZE costs,
#                 and the dev-mode profiler to ATTRIBUTE them by name (tools/profiling/CONTEXT.md).

skip_build=false
profile=false
preset_name=""

for arg in "$@"; do
  case "$arg" in
    --skip-build) skip_build=true ;;
    --profile) profile=true ;;
    *) preset_name="$arg" ;;
  esac
done

if [ -z "$preset_name" ]; then
  echo "Usage: pnpm prod:preset <instance_alias> [--skip-build] [--profile]"
  exit 1
fi

# the command the user actually typed, for error hints
cmd="pnpm prod:preset $preset_name"
build_flags=""
if [ "$profile" = true ]; then
  cmd="$cmd --profile"
  build_flags=" --webpack --profile"
fi

# Env files in dotenv-cli precedence order: the FIRST -e file wins, so list highest priority first.
# Same layering as dev.preset.sh.
env_args=()
if [ -f ./.env.local ]; then
  env_args+=( -e ./.env.local )
fi
env_args+=( -e ./.env.extra )
if [ -f ./.env.secrets ]; then
  env_args+=( -e ./.env.secrets )
fi
env_args+=( -e ./.env.tmp )

if [ "$skip_build" = false ]; then
  # Fetch the instance config into ./.env.tmp (compile-on-run)
  ./tools/dev-server/fetch.sh "$preset_name" || exit 1

  # remove previous assets
  rm -rf ./public/assets/configs
  rm -rf ./public/assets/multichain
  rm -rf ./public/assets/essential-dapps
  rm -rf ./public/assets/envs.js

  # download assets for the running instance
  dotenv \
    "${env_args[@]}" \
    -- bash -c './deploy/scripts/download_assets.sh ./public/assets/configs'

  # generate multichain config (matches both "multichain" and "staging_multichain")
  if [[ "$preset_name" =~ "multichain" ]]; then
    dotenv \
      "${env_args[@]}" \
      -- bash -c 'cd deploy/tools/multichain-config-generator && pnpm build && pnpm generate' || exit 1
  fi

  # generate essential dapps chains config if marketplace essential dapps enabled
  dotenv \
    "${env_args[@]}" \
    -- bash -c 'cd deploy/tools/essential-dapps-chains-config-generator && pnpm build && pnpm generate' || exit 1

  source ./deploy/scripts/build_sprite.sh
  echo ""

  # generate routes
  pnpm routes:generate
  echo ""

  # generate envs.js and build the app
  dotenv \
    -v NEXT_PUBLIC_GIT_COMMIT_SHA=$(git rev-parse --short HEAD) \
    -v NEXT_PUBLIC_GIT_TAG=$(git describe --tags --abbrev=0) \
    -v NEXT_PUBLIC_ICON_SPRITE_HASH="${NEXT_PUBLIC_ICON_SPRITE_HASH}" \
    "${env_args[@]}" \
    -- bash -c "source ./deploy/scripts/export_pro_api_flag.sh && ./deploy/scripts/make_envs_script.sh && next build${build_flags}" || exit 1
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
  if [ ! -f ./public/assets/envs.js ]; then
    echo "Error: public/assets/envs.js not found. Run a full build first: $cmd"
    exit 1
  fi
fi

# derive the sprite hash from the built sprite file, so the server env matches the build
# (on --skip-build the export from build_sprite.sh is not available)
if [ -z "$NEXT_PUBLIC_ICON_SPRITE_HASH" ]; then
  sprite_file=$(ls ./public/icons/sprite.*.svg 2>/dev/null | head -1)
  if [ -n "$sprite_file" ]; then
    NEXT_PUBLIC_ICON_SPRITE_HASH=$(basename "$sprite_file" | sed -E 's/^sprite\.(.+)\.svg$/\1/')
  fi
fi

# start the production server; the pro-api flag is re-exported because the server reads it at
# runtime and --skip-build never ran the build step that detects it
dotenv \
  -v NEXT_PUBLIC_GIT_COMMIT_SHA=$(git rev-parse --short HEAD) \
  -v NEXT_PUBLIC_GIT_TAG=$(git describe --tags --abbrev=0) \
  -v NEXT_PUBLIC_ICON_SPRITE_HASH="${NEXT_PUBLIC_ICON_SPRITE_HASH}" \
  "${env_args[@]}" \
  -- bash -c 'source ./deploy/scripts/export_pro_api_flag.sh && next start -p $NEXT_PUBLIC_APP_PORT' |
pino-pretty
