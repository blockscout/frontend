#!/bin/bash

# Fetch a representative instance config (eth) into ./.env.tmp
./tools/dev-server/fetch.sh eth || exit 1

dotenv \
  -e ./.env.tmp \
  -- bash -c 'cd ./deploy/tools/sitemap-generator && pnpm next-sitemap'
