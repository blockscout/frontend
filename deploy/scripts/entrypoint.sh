#!/bin/bash

# Download external assets
./download_assets.sh ./public/assets

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