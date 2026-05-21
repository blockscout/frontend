#!/bin/bash
# Must be sourced so export applies to the caller shell (see entrypoint.sh, dev.preset.sh).

SUPPORTED_CHAINS_URL='https://api.blockscout.com/api/json/config'

check_pro_api_supported() {
  local network_id="${NEXT_PUBLIC_NETWORK_ID// /}"

  if [ -z "$network_id" ]; then
    echo "⚠️ NEXT_PUBLIC_NETWORK_ID is not set. Skipping Pro API support check." >&2
    return 1
  fi

  if ! command -v jq >/dev/null 2>&1; then
    echo "⚠️ jq not found. Skipping Pro API support check." >&2
    return 1
  fi

  if ! command -v curl >/dev/null 2>&1; then
    echo "⚠️ curl not found. Skipping Pro API support check." >&2
    return 1
  fi

  echo "⏳ Checking Pro API support for chain ${network_id}..." >&2

  local response
  if ! response=$(curl -f -sS --connect-timeout 10 --max-time 30 "$SUPPORTED_CHAINS_URL"); then
    echo "⚠️ Failed to fetch Pro API config." >&2
    return 1
  fi

  if echo "$response" | jq -e --arg id "$network_id" '.chains[$id]' >/dev/null; then
    echo "✅ Chain ${network_id} is supported by Blockscout PRO API." >&2
    return 0
  fi

  echo "ℹ️  Chain ${network_id} is not supported by Blockscout PRO API." >&2
  return 1
}

if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  echo "This script must be sourced. Use: source ./export_pro_api_flag.sh" >&2
  exit 1
fi

if [ -n "${NEXT_PUBLIC_PRO_API_SUPPORTED}" ]; then
  echo "ℹ️  NEXT_PUBLIC_PRO_API_SUPPORTED is already set to '${NEXT_PUBLIC_PRO_API_SUPPORTED}'. Skipping auto-detection." >&2
elif check_pro_api_supported; then
  export NEXT_PUBLIC_PRO_API_SUPPORTED=true
fi

echo ""
