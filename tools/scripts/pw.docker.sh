#!/bin/bash

# Enable pnpm in the container (Playwright image has Node but not pnpm)
corepack enable
corepack prepare pnpm@10.32.1 --activate

export NODE_PATH=$(pwd)/node_modules_linux

pnpm test:pw "$@"
