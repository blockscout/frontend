#!/bin/bash

# Regenerates the default favicon pack committed under public/assets/favicon/ from the Blockscout
# master favicon.svg beside this script. The container runs the same generator from the network icon
# instead (deploy/scripts/favicon_generator.sh).

favicon_folder="../../../public/assets/favicon/"

MASTER_FILE="$(pwd)/favicon.svg" node ./index.js || exit 1

if [ -d "$favicon_folder" ]; then
  rm -r "$favicon_folder"
fi
mkdir -p "$favicon_folder"
cp -r ./output/* "$favicon_folder"
