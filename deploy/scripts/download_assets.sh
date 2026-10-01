#!/bin/bash

echo
echo "⬇️  Downloading external assets..."

# Check if the number of arguments provided is correct
if [ "$#" -ne 1 ]; then
  echo "🛑 Error: incorrect amount of arguments. Usage: $0 <ASSETS_DIR>."
  exit 1
fi

# Define the directory to save the downloaded assets
ASSETS_DIR="$1"

# Define a list of environment variables containing URLs of external assets
ASSETS_ENVS=(
    "NEXT_PUBLIC_MARKETPLACE_CONFIG_URL"
    "NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL"
    "NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL"
    "NEXT_PUBLIC_MARKETPLACE_GRAPH_LINKS_URL"
    "NEXT_PUBLIC_FEATURED_NETWORKS"
    "NEXT_PUBLIC_FOOTER_LINKS"
    "NEXT_PUBLIC_NETWORK_LOGO"
    "NEXT_PUBLIC_NETWORK_LOGO_DARK"
    "NEXT_PUBLIC_NETWORK_ICON"
    "NEXT_PUBLIC_NETWORK_ICON_DARK"
    "NEXT_PUBLIC_OG_IMAGE_URL"
    "NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL"
    "NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL"
    "NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG"
)

# Create the assets directory if it doesn't exist
mkdir -p "$ASSETS_DIR"

# Track failed downloads
FAILED_DOWNLOADS=0

# Function to determine the target file name based on the environment variable.
# Must mirror buildExternalAssetFilePath() in src/config/utils/envs.ts, which is how the app
# computes the path it will request.
get_target_filename() {
    local env_var="$1"
    local url="${!env_var}"

    # Extract the middle part of the variable name (between "NEXT_PUBLIC_" and "_URL") in lowercase
    local name_prefix="${env_var#NEXT_PUBLIC_}"
    local name_suffix="${name_prefix%_URL}"
    local name_lc="$(echo "$name_suffix" | tr '[:upper:]' '[:lower:]')"

    local filename
    if [[ "$url" == file://* ]]; then
        filename=$(basename "${url#file://}")
    elif [[ "$url" == http* ]]; then
        # Remove query parameters and fragment from the URL and get the last path segment
        filename=$(basename "${url%%[\?#]*}")
    else
        # Raw JSON content
        echo "$name_lc.json"
        return
    fi

    # A path without a file extension (e.g. Cloudflare Images ".../<id>/public") is saved under the bare name
    if [[ "$filename" != *.* ]]; then
        echo "$name_lc"
        return
    fi

    local extension="${filename##*.}"
    extension=$(echo "$extension" | tr '[:upper:]' '[:lower:]')
    echo "$name_lc.$extension"
}

# Function to download and save an asset
download_and_save_asset() {
    local env_var="$1"
    local url="$2"
    local filename="$3"
    local destination="$ASSETS_DIR/$filename"

    # Check if the environment variable is set
    if [ -z "${!env_var}" ]; then
        echo "   [.] $env_var: Variable is not set. Skipping download."
        return 1
    fi

    # Check if the URL starts with "file://"
    if [[ "$url" == file://* ]]; then
        # Copy the local file to the destination
        cp "${url#file://}" "$destination"
    else
        # Check if the value is a URL
        if [[ "$url" == http* ]]; then
            # Download the asset using curl with built-in retries
            if ! curl -f -s --connect-timeout 10 --max-time 60 --retry 3 --retry-delay 3 --retry-max-time 180 -o "$destination" "$url"; then
                echo "   [-] $env_var: Failed to download from $url after 3 retry attempts (timeout or connection error)"
                FAILED_DOWNLOADS=$((FAILED_DOWNLOADS + 1))
                return 1
            fi
        else
            # Convert single-quoted JSON-like content to valid JSON
            json_content=$(echo "${!env_var}" | sed "s/'/\"/g")

            # Save the JSON content to a file
            echo "$json_content" > "$destination"
        fi
    fi

    if [[ "$url" == file://* ]] || [[ "$url" == http* ]]; then
        local source_name=$url
    else
        local source_name="raw input"
    fi

    # Check if the download was successful
    if [ $? -eq 0 ]; then
        echo "   [+] $env_var: Successfully saved file from $source_name to $destination."
        return 0
    else
        echo "   [-] $env_var: Failed to save file from $source_name."
        return 1
    fi
}

# Iterate through the list and download assets
for env_var in "${ASSETS_ENVS[@]}"; do
    url="${!env_var}"
    filename=$(get_target_filename "$env_var")
    download_and_save_asset "$env_var" "$url" "$filename"
done

# Check if any downloads failed and exit with error code
if [ $FAILED_DOWNLOADS -gt 0 ]; then
    echo "🛑 Error: $FAILED_DOWNLOADS asset download(s) failed. The application cannot start."
    exit 1
fi

echo "✅ Done."
echo
