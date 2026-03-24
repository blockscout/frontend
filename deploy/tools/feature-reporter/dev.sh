#!/bin/bash

rm -rf ./dist
pnpm build
dotenv -e ../../../configs/envs/.env.main -e ../../../configs/envs/.env.secrets pnpm print_report
