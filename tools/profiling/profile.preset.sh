#!/bin/bash

# Production build + serve with React profiling enabled, wired to a live instance's
# env config the same way as `pnpm dev:preset <alias>` (see tools/dev-server/CONTEXT.md).
#
# Usage:
#   pnpm profile:preset <instance_alias>               # full: fetch envs, build, serve
#   pnpm profile:preset <instance_alias> --skip-build  # re-serve the existing profiling build
#
# The build runs `next build --webpack --profile`:
#   --profile aliases react-dom to react-dom/profiling, so the React DevTools Profiler
#     works against an otherwise production build (minified, prod JSX runtime, no dev-only checks);
#   --webpack is used because --profile is guaranteed on the webpack pipeline, while Turbopack's
#     (the Next 16 default) support for production profiling is not documented;
#     next.config.js maintains both pipelines.
#
# NOTE: most component names in the profiler are minified in this build — use it to SIZE costs,
# and the dev-mode profiler to ATTRIBUTE them by name.

if [ "$#" -lt 1 ]; then
  echo "Usage: pnpm profile:preset <instance_alias> [--skip-build]"
  exit 1
fi

preset_name="$1"
skip_build=false
if [ "$2" == "--skip-build" ]; then
  skip_build=true
fi

# Fetch the instance config into ./.env.tmp (compile-on-run)
./tools/dev-server/fetch.sh "$preset_name" || exit 1

# Env files in dotenv-cli precedence order: the FIRST -e file wins, so list highest priority first.
#   .env.local   (git-ignored, personal local overrides) — optional
#   .env.extra   (committed branch/feature ENVs, also read by the demo deploy)
#   .env.secrets (git-ignored local secrets) — optional; the fetched config already carries public keys
#   .env.tmp     (fetched instance config)
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

  # production build with the profiling react-dom + envs.js for the runtime config
  dotenv \
    -v NEXT_PUBLIC_GIT_COMMIT_SHA=$(git rev-parse --short HEAD) \
    -v NEXT_PUBLIC_GIT_TAG=$(git describe --tags --abbrev=0) \
    -v NEXT_PUBLIC_ICON_SPRITE_HASH="${NEXT_PUBLIC_ICON_SPRITE_HASH}" \
    "${env_args[@]}" \
    -- bash -c 'source ./deploy/scripts/export_pro_api_flag.sh && next build --webpack --profile && ./deploy/scripts/make_envs_script.sh' || exit 1

  echo ""
  echo "Profiling build ready. Starting the server..."
fi

# serve the production build
dotenv \
  -v NEXT_PUBLIC_GIT_COMMIT_SHA=$(git rev-parse --short HEAD) \
  -v NEXT_PUBLIC_GIT_TAG=$(git describe --tags --abbrev=0) \
  -v NEXT_PUBLIC_ICON_SPRITE_HASH="${NEXT_PUBLIC_ICON_SPRITE_HASH}" \
  "${env_args[@]}" \
  -- bash -c 'source ./deploy/scripts/export_pro_api_flag.sh && next start -p $NEXT_PUBLIC_APP_PORT' |
pino-pretty
