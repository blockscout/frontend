#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Usage: yarn dev:preset <preset_name>"
  exit 1
fi

preset_name="$1"
config_file="./configs/envs/.env.${preset_name}"
secrets_file="./configs/envs/.env.secrets"

if [ ! -f "$config_file" ]; then
    echo "Error: File '$config_file' not found."
    exit 1
fi

if [ ! -f "$secrets_file" ]; then
    echo "Error: File '$secrets_file' not found."
    exit 1
fi

dotenv -e $config_file -e $secrets_file -- bash -c 'next dev -- -p $NEXT_PUBLIC_APP_PORT' | pino-pretty