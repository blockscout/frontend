#!/bin/bash

# use this script for testing the og image generator

# Fetch a representative instance config (eth) into ./.env.tmp
./tools/dev-server/fetch.sh arbitrum || exit 1

dotenv \
  -e ./.env.tmp \
  -- bash -c 'node ./deploy/scripts/og_image_generator.js'
