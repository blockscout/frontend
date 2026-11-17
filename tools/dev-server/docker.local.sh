#!/bin/bash

# Runs the locally built image (see docker.build.sh) against a LOCAL backend using the committed
# tools/dev-server/.env.localhost config — the docker counterpart of dev.local.sh, with the same
# env layering.

source ./tools/dev-server/run_steps.sh

usage="Usage: pnpm start:docker:local"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --)
      shift ;;
    *)
      echo "🚨 Unknown argument \"$1\"."
      echo "$usage"
      exit 1 ;;
  esac
done

build_docker_env_args ./tools/dev-server/.env.localhost

docker run -p 3000:3000 "${docker_env_args[@]}" blockscout-frontend:local | pino-pretty
