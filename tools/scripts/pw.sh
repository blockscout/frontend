#!/bin/bash

config_file="./configs/envs/.env.pw"

rm -rf ./playwright/.cache

dotenv \
  -e $config_file \
  -- bash -c './deploy/scripts/make_envs_script.sh ./playwright/envs.js'

dotenv \
  -v NODE_OPTIONS=\"--max-old-space-size=4096\" \
  -e $config_file \
  -- playwright test -c playwright-ct.config.ts "$@"
