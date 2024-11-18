secrets_file="./configs/envs/.env.secrets"
favicon_folder="./public/assets/favicon/"
master_url="https://raw.githubusercontent.com/blockscout/frontend/main/tools/scripts/favicon.svg"

if [ ! -f "$secrets_file" ]; then
    echo "Error: File '$secrets_file' not found."
    exit 1
fi

dotenv \
  -v MASTER_URL=$master_url \
  -- bash -c 'cd ./deploy/tools/favicon-generator && node "$(dirname "$0")/index.js"'

if [ -d "$favicon_folder" ]; then
  rm -r "$favicon_folder"
fi
mkdir -p "$favicon_folder"
cp -r ./deploy/tools/favicon-generator/output/* "$favicon_folder"