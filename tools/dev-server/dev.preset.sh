#!/bin/bash

usage="Usage: pnpm dev:preset <instance_alias> [--port <number>]"

port=""
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
    *)
      positional+=( "$1" ); shift ;;
  esac
done

if [ "${#positional[@]}" -ne 1 ]; then
  echo "$usage"
  exit 1
fi

if [ -n "$port" ] && ! [[ "$port" =~ ^[0-9]+$ ]]; then
  echo "🚨 Invalid --port value \"$port\" — expected a number."
  echo "$usage"
  exit 1
fi

preset_name="${positional[0]}"

# --port overrides NEXT_PUBLIC_APP_PORT (dotenv-cli applies -v variables AFTER the -e files,
# so this beats every env file). Overriding the env var — not just `next dev -p` — keeps the
# generated envs.js and config.app.baseUrl consistent with the actual port.
port_args=()
if [ -n "$port" ]; then
  port_args+=( -v NEXT_PUBLIC_APP_PORT="$port" )
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

# generate envs.js file and run the app
dotenv \
  -v NEXT_PUBLIC_GIT_COMMIT_SHA=$(git rev-parse --short HEAD) \
  -v NEXT_PUBLIC_GIT_TAG=$(git describe --tags --abbrev=0) \
  -v NEXT_PUBLIC_ICON_SPRITE_HASH="${NEXT_PUBLIC_ICON_SPRITE_HASH}" \
  "${port_args[@]}" \
  "${env_args[@]}" \
  -- bash -c 'source ./deploy/scripts/export_pro_api_flag.sh && ./deploy/scripts/make_envs_script.sh && next dev -p $NEXT_PUBLIC_APP_PORT' |
pino-pretty
