#!/bin/bash

rm -rf ./build
pnpm compile_config
pnpm build
dotenv -e ../../../configs/envs/.env.main -e ../../../configs/envs/.env.secrets pnpm print_report