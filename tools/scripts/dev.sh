#!/bin/bash

# download assets for the running instance
dotenv \
  -e .env.development.local \
  -e .env.local \
  -e .env.development \
  -e .env \
  -- bash -c './deploy/scripts/download_assets.sh ./public/assets/configs'

yarn svg:build-sprite
echo ""

# generate envs.js file and run the app
# Replaced tag with hardcoded dev tag for alicenet development
dotenv \
  -v NEXT_PUBLIC_GIT_COMMIT_SHA=$(git rev-parse --short HEAD) \
  -v NEXT_PUBLIC_GIT_TAG=alicenet_explorer_scour_dev \
  -e .env.secrets \
  -e .env.development.local \
  -e .env.local \
  -e .env.development \
  -e .env \
  -- bash -c './deploy/scripts/make_envs_script.sh && next dev -p $NEXT_PUBLIC_APP_PORT' |
pino-pretty