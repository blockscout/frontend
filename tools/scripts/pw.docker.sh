#!/bin/bash

# Enable pnpm in the container (Playwright image has Node but not pnpm)
corepack enable
corepack prepare pnpm@11.5.1 --activate

# test:pw:docker mounts node_modules_linux over node_modules in the container so
# Node resolves Linux-native optional deps (e.g. @rollup/rollup-linux-arm64-gnu).
if [ ! -f node_modules_linux/.modules.yaml ]; then
  echo "Linux dependencies are missing. Install them with: pnpm test:pw:docker:deps"
  exit 1
fi

export PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false

pnpm test:pw "$@"
