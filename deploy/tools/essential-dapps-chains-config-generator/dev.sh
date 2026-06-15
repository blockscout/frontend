#!/bin/bash

# Fetch a representative instance config (eth) into ./.env.tmp (in this tool's dir)
../../../tools/dev-server/fetch.sh eth || exit 1

dotenv \
  -e ./.env.tmp \
  -- bash -c 'pnpm build && pnpm generate'
