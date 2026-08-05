#!/bin/bash

# Runs the dev server against a LOCAL backend using the committed tools/dev-server/.env.localhost
# config (no HTTP fetch). Layer your own overrides via .env.local / .env.extra / .env.secrets.
# The shared steps live in run_steps.sh.

source ./tools/dev-server/run_steps.sh

usage="Usage: pnpm dev:local [--port <number>]"

port=""
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
    --)
      # `pnpm dev:local -- --port 3001` forwards the separator into the script; drop it
      shift ;;
    *)
      echo "🚨 Unknown argument \"$1\"."
      echo "$usage"
      exit 1 ;;
  esac
done

build_port_args "$port" "$usage"
build_env_args ./tools/dev-server/.env.localhost

# no preset name: a local backend serves a single chain, so there is no multichain config
prepare_assets

# generate envs.js file and run the app
run_with_envs 'source ./deploy/scripts/export_pro_api_flag.sh && ./deploy/scripts/make_envs_script.sh && next dev -p $NEXT_PUBLIC_APP_PORT' |
pino-pretty
