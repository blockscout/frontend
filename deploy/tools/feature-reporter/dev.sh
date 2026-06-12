#!/bin/bash

rm -rf ./dist
pnpm build

# Fetch the staging instance config into ./.env.tmp (in this tool's dir)
../../../tools/dev-server/fetch.sh staging || exit 1

dotenv -e ./.env.tmp -e ../../../.env.secrets pnpm print_report
