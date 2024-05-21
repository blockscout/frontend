#!/bin/bash


export_envs_from_preset() {
  if [ -z "$ENVS_PRESET" ]; then
      return
  fi

  if [ "$ENVS_PRESET" = "none" ]; then
      return
  fi

  local preset_file="./configs/envs/.env.$ENVS_PRESET"

  if [ ! -f "$preset_file" ]; then
      return
  fi

  local blacklist=(
    "NEXT_PUBLIC_APP_PROTOCOL" 
    "NEXT_PUBLIC_APP_HOST"
    "NEXT_PUBLIC_APP_PORT"
    "NEXT_PUBLIC_APP_ENV"
    "NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL"
  )

  while IFS='=' read -r name value; do
      name="${name#"${name%%[![:space:]]*}"}"  # Trim leading whitespace
      if [[ -n $name && $name == "NEXT_PUBLIC_"* && ! "${blacklist[*]}" =~ "$name" ]]; then
          export "$name"="$value"
      fi
  done < <(grep "^[^#;]" "$preset_file")
}

# If there is a preset, load the environment variables from the its file
export_envs_from_preset

# Download external assets
./download_assets.sh ./public/assets/configs

# Check run-time ENVs values
./validate_envs.sh
if [ $? -ne 0 ]; then
  exit 1
fi

# Generate favicons bundle
./favicon_generator.sh
if [ $? -ne 0 ]; then
  echo "👎 Unable to generate favicons bundle."
else
  echo "👍 Favicons bundle successfully generated."
fi
echo

# Create envs.js file with run-time environment variables for the client app
./make_envs_script.sh

# Print list of enabled features
node ./feature-reporter.js

echo "Starting Next.js application"
exec "$@"