#!/bin/bash

echo "🌀 Creating client script with ENV values..."

# Define the output file name
output_file="./public/envs.js"

touch $output_file;
truncate -s 0 $output_file;

# Check if the .env file exists and load ENVs from it
if [ -f .env ]; then
    source .env
fi

echo "window.__envs = {" >> $output_file;

# Iterate through all environment variables
for var in $(env | grep '^NEXT_PUBLIC_' | cut -d= -f1); do
  # Get the value of the variable
  value="${!var}"

  # Write the variable name and value to the output file
  echo "${var}: \"${value}\"," >> "$output_file"
done

echo "}" >> $output_file;

echo "✅ Done."
