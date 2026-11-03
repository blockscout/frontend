#!/bin/bash

# Generates sitemap.xml / robots.txt into the repo's public/ from a representative instance config
# (eth), fetched into ./.env.tmp (in this tool's dir). Reads the repo-root .next build output, so run
# a production build first (e.g. `pnpm prod:preset eth`).

../../../tools/dev-server/fetch.sh eth || exit 1

dotenv \
  -e ./.env.tmp \
  -- bash -c 'pnpm next-sitemap'
