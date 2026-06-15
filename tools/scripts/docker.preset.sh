#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Usage: pnpm start:docker:preset <preset_name>"
  exit 1
fi

preset_name="$1"
secrets_file="./.env.secrets"

# Fetch the instance config into ./.env.tmp (raw KEY=value, docker --env-file compatible)
./tools/dev-server/fetch.sh "$preset_name" || exit 1

if [ ! -f "$secrets_file" ]; then
    echo "Error: File '$secrets_file' not found."
    exit 1
fi

docker run -p 3000:3000 --env-file ./.env.tmp --env-file $secrets_file blockscout-frontend:local | pino-pretty