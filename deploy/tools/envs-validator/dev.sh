#!/bin/bash

cp ../../../types/envs.ts .
export NEXT_PUBLIC_GIT_COMMIT_SHA=$(git rev-parse --short HEAD)
export NEXT_PUBLIC_GIT_TAG=$(git describe --tags --abbrev=0)
../../scripts/make_envs_template.sh ../../../docs/ENVS.md
yarn build
dotenv -e ../../../configs/envs/.env.main -e ../../../configs/envs/.env.secrets yarn validate