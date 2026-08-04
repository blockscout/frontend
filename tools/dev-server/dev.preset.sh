#!/bin/bash

# Runs the dev server against a live instance's config, fetched over HTTP at startup.
# The shared steps live in run_steps.sh.

source ./tools/dev-server/run_steps.sh

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
    --)
      # `pnpm dev:preset -- eth` forwards the separator into the script; drop it
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

build_port_args "$port" "$usage"

# Fetch the instance config into ./.env.tmp (compile-on-run)
./tools/dev-server/fetch.sh "$preset_name" || exit 1

build_env_args ./.env.tmp
prepare_assets "$preset_name"

# generate envs.js file and run the app
run_with_envs 'source ./deploy/scripts/export_pro_api_flag.sh && ./deploy/scripts/make_envs_script.sh && next dev -p $NEXT_PUBLIC_APP_PORT' |
pino-pretty
