#!/bin/bash

rm -rf ./dist
pnpm build

# Fetch the staging instance config into ./.env.tmp (in this tool's dir)
../../../tools/dev-server/fetch.sh staging || exit 1

# dotenv-cli: the FIRST -e wins, so list .env.secrets before .env.tmp to let it override.
dotenv -e ../../../.env.secrets -e ./.env.tmp pnpm print_report
