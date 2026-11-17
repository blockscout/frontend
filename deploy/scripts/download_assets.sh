#!/bin/bash

# Runs the assets downloader (deploy/tools/assets-downloader): the bundle copied next to this script
# in the container image, or a fresh build when invoked from the source tree.

script_dir="$(dirname "$0")"
bundle="$script_dir/assets-downloader/index.js"

if [ ! -f "$bundle" ]; then
  tool_dir="$script_dir/../tools/assets-downloader"
  (cd "$tool_dir" && pnpm run build) || exit 1
  bundle="$tool_dir/dist/index.js"
fi

node --no-warnings "$bundle" "$@"
