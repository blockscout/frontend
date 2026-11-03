#!/bin/bash

# Builds the production image locally as blockscout-frontend:local, tagged with the current git
# sha / tag. Run it with docker.preset.sh or docker.local.sh.

source ./tools/dev-server/run_steps.sh

# the Dockerfile COPYs public/ into the image, so a stale local run must not leak into it
clean_assets

docker build \
  --progress=plain \
  --build-arg GIT_COMMIT_SHA=$(git rev-parse --short HEAD) \
  --build-arg GIT_TAG=$(git describe --tags --abbrev=0) \
  -t blockscout-frontend:local ./
