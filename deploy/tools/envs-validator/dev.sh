#!/bin/bash

export NEXT_PUBLIC_GIT_COMMIT_SHA=$(git rev-parse --short HEAD)
export NEXT_PUBLIC_GIT_TAG=$(git describe --tags --abbrev=0)
../../scripts/collect_envs.sh ../../../docs/ENVS.md

yarn build

PRESETS=(
    "main"
    "main.L2"
)

validate_preset() {
    local preset="$1"
    secrets_file="../../../configs/envs/.env.secrets"
    config_file="../../../configs/envs/.env.${preset}"

    echo
    echo "------------------------------------------------"
    echo "🧿 Validating preset '$preset'..."

    dotenv \
        -e $config_file \
        -- bash -c '../../scripts/download_assets.sh ./public/assets'

    dotenv \
        -e $config_file \
        -e $secrets_file \
            yarn validate

    if [ $? -eq 0 ]; then
        echo "✅ Preset '$preset' is valid."
        echo "------------------------------------------------"
        echo
        return 0
    else
        echo "🛑 Preset '$preset' is invalid. Please fix it and run script again."
        echo "------------------------------------------------"
        echo
        return 1
    fi
}


for preset in "${PRESETS[@]}"; do
    validate_preset "$preset"
    if [ $? -eq 1 ]; then
        exit 1
    fi
done