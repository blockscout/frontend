#!/bin/bash

config_file="./configs/envs/.env.pw"

rm -rf ./playwright/.cache

set -a
source "$config_file"
set +a

export NODE_OPTIONS="--max-old-space-size=4096"

./deploy/scripts/make_envs_script.sh
playwright test -c playwright-ct.config.ts "$@"