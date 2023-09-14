#!/bin/bash

export NEXT_PUBLIC_GIT_COMMIT_SHA=$(git rev-parse --short HEAD)
export NEXT_PUBLIC_GIT_TAG=$(git describe --tags --abbrev=0)
../../scripts/make_envs_template.sh ../../../docs/ENVS.md

config_file="../../../configs/envs/.env.eth_goerli"
secrets_file="../../../configs/envs/.env.secrets"

dotenv \
  -e $config_file \
  -- bash -c '../../scripts/download_assets.sh ./public/assets'

yarn build

dotenv \
  -e $config_file \
  -e $secrets_file \
    yarn validate