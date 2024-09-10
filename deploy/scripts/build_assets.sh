#!/bin/bash

# generate sprite
yarn svg:build-sprite
echo ""

# generate envs.js file
dotenv \
  -- bash -c './deploy/scripts/make_envs_script.sh' |
pino-pretty
