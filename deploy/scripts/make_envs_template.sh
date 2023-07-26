#!/bin/bash

input_file="./docs/ENVS.md"
output_file=".env.production"
prefix="NEXT_PUBLIC_"

# Function to make the environment variables template file for production build
# It will read the input file, extract all prefixed string and use them as variables names
make_envs_template_file() {
    grep -oE 'NEXT_PUBLIC_[[:alnum:]_]+' "$input_file" | sort -u | while IFS= read -r var_name; do
        echo "$var_name=__PLACEHOLDER_FOR_${var_name}__" >> "$output_file"
    done
}

# Check if file already exists and empty its content if it does
if [ -f "$output_file" ]; then
  > "$output_file"
fi

make_envs_template_file
