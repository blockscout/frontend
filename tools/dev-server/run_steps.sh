#!/bin/bash

# The steps every local run script performs, in the order they perform them:
# layer the env files, regenerate what the app reads from disk at boot, launch.
# Shared by dev.preset.sh, dev.local.sh and prod.preset.sh — what stays in those scripts is
# their argument parsing and the command they finally run.
#
# Must be SOURCED, not executed: prepare_assets sources deploy/scripts/build_sprite.sh so the
# icon sprite hash it exports reaches the launch step, and the functions report results through
# the shell variables named in each comment. All of them assume the repo root is the cwd.

if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  echo "This script must be sourced. Use: source ./tools/dev-server/run_steps.sh" >&2
  exit 1
fi

# The launch command is piped into pino-pretty, so without pipefail the script's exit status would
# be pino-pretty's — a failure on the left of the pipe (a broken envs.js, a server that won't boot)
# would report success. Set here because run_with_envs is what establishes that pipe.
set -o pipefail

port_args=()
env_args=()

# --port overrides NEXT_PUBLIC_APP_PORT (dotenv-cli applies -v variables AFTER the -e files,
# so this beats every env file). Overriding the env var — not just `next dev -p` — keeps the
# generated envs.js and config.app.baseUrl consistent with the actual port.
#
# Usage: build_port_args "$port" "$usage"   — an empty port leaves the env files in charge.
# Sets: port_args
build_port_args() {
  local port="$1" usage="$2"

  port_args=()
  if [ -z "$port" ]; then
    return
  fi

  if ! [[ "$port" =~ ^[0-9]+$ ]]; then
    echo "🚨 Invalid --port value \"$port\" — expected a number."
    echo "$usage"
    exit 1
  fi

  port_args+=( -v NEXT_PUBLIC_APP_PORT="$port" )
}

# Env files in dotenv-cli precedence order: the FIRST -e file wins, so list highest priority first.
#   .env.local   (git-ignored, personal local overrides) — optional
#   .env.extra   (committed branch/feature ENVs, also read by the demo deploy)
#   .env.secrets (git-ignored local secrets) — optional; a fetched config already carries public keys
#   $1           (the base config: the fetched .env.tmp, or .env.localhost for a local backend)
#
# Usage: build_env_args <base_env_file>
# Sets: env_args
build_env_args() {
  env_args=()
  if [ -f ./.env.local ]; then
    env_args+=( -e ./.env.local )
  fi
  env_args+=( -e ./.env.extra )
  if [ -f ./.env.secrets ]; then
    env_args+=( -e ./.env.secrets )
  fi
  env_args+=( -e "$1" )
}

# Regenerates everything the app reads off disk at boot: the downloaded instance assets, the
# generated configs, the icon sprite and the route map.
#
# Usage: prepare_assets [preset_name]   — a preset_name matching "multichain" also generates the
#        multichain config; omit it for a local-backend run, which has no multichain config.
# Reads: env_args
# Exports: NEXT_PUBLIC_ICON_SPRITE_HASH (via build_sprite.sh)
prepare_assets() {
  local preset_name="$1"

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
}

# Runs a command with the full env: the build-time variables that end up in envs.js (git sha/tag,
# sprite hash), then the env files, then the --port override.
#
# Usage: run_with_envs "<shell command>"   — pipe it to pino-pretty for long-running servers;
#        one-shot commands (a build) should check the exit code instead.
# Reads: env_args, port_args, NEXT_PUBLIC_ICON_SPRITE_HASH
run_with_envs() {
  dotenv \
    -v NEXT_PUBLIC_GIT_COMMIT_SHA=$(git rev-parse --short HEAD) \
    -v NEXT_PUBLIC_GIT_TAG=$(git describe --tags --abbrev=0) \
    -v NEXT_PUBLIC_ICON_SPRITE_HASH="${NEXT_PUBLIC_ICON_SPRITE_HASH}" \
    "${port_args[@]}" \
    "${env_args[@]}" \
    -- bash -c "$1"
}
