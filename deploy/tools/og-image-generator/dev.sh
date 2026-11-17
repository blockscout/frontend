#!/bin/bash

# Generates the OG image into the repo's public/static/ from a representative instance config (eth),
# fetched into ./.env.tmp (in this tool's dir).

../../../tools/dev-server/fetch.sh eth || exit 1

# index.js resolves public/ against the cwd, so run it from the repo root
dotenv \
  -e ./.env.tmp \
  -- bash -c 'cd ../../.. && node --no-warnings ./deploy/tools/og-image-generator/index.js'
