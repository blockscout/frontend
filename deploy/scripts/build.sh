#!/bin/bash

yarn svg:build-sprite
echo ""

# generate envs.js file
-- bash -c './deploy/scripts/make_envs_script.sh && next dev -p $NEXT_PUBLIC_APP_PORT' |
pino-pretty