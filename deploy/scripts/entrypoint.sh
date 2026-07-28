#!/bin/bash


# Export KEY=value lines from a file into the environment (skips blank lines and # comments).
export_envs_from_file() {
  local file="$1"
  [ -f "$file" ] || return 0
  # `|| [ -n "$name" ]` keeps the final line even when the file has no trailing
  # newline — otherwise `read` returns non-zero at EOF and silently drops it.
  while IFS='=' read -r name value || [ -n "$name" ]; do
      if [[ -n "$name" && "$name" != \#* ]]; then
          export "$name"="$value"
      fi
  done < "$file"
}

# If there is a preset, fetch the source instance's public config and load it into the environment.
load_envs_from_preset() {
  if [ -z "$ENVS_PRESET" ] || [ "$ENVS_PRESET" = "none" ]; then
      return
  fi

  local tmp_file="/tmp/.env.tmp"

  # --omit-local-envs drops the local APP_* keys so the deployment's own values are preserved.
  if ! node ./tools/dev-server/fetch.js "$ENVS_PRESET" --omit-local-envs --out="$tmp_file"; then
      echo "🛑 Failed to fetch ENVs for preset '$ENVS_PRESET'. The application cannot start."
      exit 1
  fi

  # Instance config first, then committed branch/feature overrides (.env.extra) win.
  export_envs_from_file "$tmp_file"
  export_envs_from_file ./.env.extra
}

load_envs_from_preset

# Download external assets
./download_assets.sh ./public/assets/configs
if [ $? -ne 0 ]; then
  echo "🛑 Failed to download external assets. The application cannot start."
  exit 1
fi

# Check run-time ENVs values
if [ "$SKIP_ENVS_VALIDATION" != "true" ]; then
  ./validate_envs.sh
  if [ $? -ne 0 ]; then
    exit 1
  fi
else
  echo "😱 Skipping ENVs validation."
  echo
fi

# Generate favicons bundle
./favicon_generator.sh
if [ $? -ne 0 ]; then
  echo "👎 Unable to generate favicons bundle."
else
  echo "👍 Favicons bundle successfully generated."
fi
echo

# Generate OG image
node --no-warnings ./og_image_generator.js

# Expose Pro API support flag for the current chain (if NEXT_PUBLIC_NETWORK_ID is set)
source ./export_pro_api_flag.sh

# Create envs.js file with run-time environment variables for the client app
./make_envs_script.sh

# Generate multichain config
node --no-warnings ./deploy/tools/multichain-config-generator/dist/index.js
if [ $? -ne 0 ]; then
  echo "👎 Unable to generate multichain config."
  exit 1
fi

# Generate essential dapps chains config
node --no-warnings ./deploy/tools/essential-dapps-chains-config-generator/dist/index.js
if [ $? -ne 0 ]; then
  echo "👎 Unable to generate essential dapps chains config."
  exit 1
fi

# Generate sitemap.xml and robots.txt files
./sitemap_generator.sh

# Generate llms.txt file
node --no-warnings ./deploy/tools/llms-txt-generator/dist/index.js

# Print list of enabled features
node --no-warnings ./feature-reporter.js

echo "Starting Next.js application"
exec "$@"
