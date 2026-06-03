#!/bin/bash
 
# Install build tools required for native dependencies
apt-get update && apt-get install -y \
    build-essential \
    python3 \
    cmake \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*
    
# Enable pnpm in the container (Playwright image has Node but not pnpm)
corepack enable
corepack prepare pnpm@11.5.1 --activate

# Set environment variables to help with native compilation
export npm_config_build_from_source=false
export npm_config_prefer_offline=true

# Non-interactive install in Docker (pnpm 11 may prompt to purge node_modules otherwise).
export CI=true
pnpm install --modules-dir node_modules_linux --config.confirm-modules-purge=true