#!/bin/bash

if [ -n "$FAVICON_MASTER_URL" ]; then
    export MASTER_URL="$FAVICON_MASTER_URL"
else
    # The downloader has already fetched and checked NEXT_PUBLIC_NETWORK_ICON; reuse that copy instead of fetching the URL again.
    export MASTER_FILE="$(ls "$(pwd)"/public/assets/configs/network_icon "$(pwd)"/public/assets/configs/network_icon.* 2>/dev/null | head -n 1)"
fi

cd ./deploy/tools/favicon-generator
node "$(pwd)/index.js"
if [ $? -ne 0 ]; then
    cd ../../../
    exit 1
else
    cd ../../../
    favicon_folder="./public/assets/favicon/"

    echo "⏳ Replacing default favicons with freshly generated pack..."
    if [ -d "$favicon_folder" ]; then
        rm -r "$favicon_folder"
    fi
    mkdir -p "$favicon_folder"
    cp -r ./deploy/tools/favicon-generator/output/* "$favicon_folder"
fi
