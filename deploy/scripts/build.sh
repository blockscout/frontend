#!/bin/bash

yarn svg:build-sprite
echo ""

# generate envs.js file
-- bash -c './make_envs_script.sh && next dev -p $NEXT_PUBLIC_APP_PORT' |
pino-pretty