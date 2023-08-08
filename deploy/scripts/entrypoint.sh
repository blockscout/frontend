#!/bin/bash

# Check run-time ENVs values integrity
node "$(dirname "$0")/envs-validator.js" "$input"
if [ $? != 0 ]; then                   
   echo 🛑 ENV integrity check failed. 1>&2 && exit 1
fi

# Execute script for replace build-time ENVs placeholders with their values at runtime
./replace_envs.sh

# Print list of enabled features
node ./feature-reporter.js

echo "Starting Next.js application"
exec "$@"