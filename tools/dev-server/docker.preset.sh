#!/bin/bash

# Runs the locally built image (see docker.build.sh) against a live instance's config, fetched over
# HTTP at startup — the docker counterpart of dev.preset.sh, with the same env layering.

source ./tools/dev-server/run_steps.sh

usage="Usage: pnpm start:docker:preset <instance_alias>"

positional=()
while [ "$#" -gt 0 ]; do
  case "$1" in
    --)
      # `pnpm start:docker:preset -- eth` forwards the separator into the script; drop it
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

# Fetch the instance config into ./.env.tmp (raw KEY=value, docker --env-file compatible)
./tools/dev-server/fetch.sh "$preset_name" || exit 1

build_docker_env_args ./.env.tmp

docker run -p 3000:3000 "${docker_env_args[@]}" blockscout-frontend:local | pino-pretty
