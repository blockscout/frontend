secrets_file=".env"
favicon_folder="./public/favicon/"

if [ ! -f "$secrets_file" ]; then
    echo "Error: File '$secrets_file' not found."
    exit 1
fi

master_url=$(grep -i '^NEXT_PUBLIC_FAVICON_MASTER_URL=' "$secrets_file" | cut -d '=' -f 2)

if [ -z "$master_url" ]; then
    echo "Error: 'NEXT_PUBLIC_FAVICON_MASTER_URL' not found in '$secrets_file'. Please add it to your .env file."
    exit 1
fi

dotenv \
  -v MASTER_URL=$master_url \
  -e $secrets_file \
  -- bash -c 'cd ./deploy/tools/favicon-generator && ./script.sh'

if [ -d "$favicon_folder" ]; then
  rm -r "$favicon_folder"
fi
mkdir -p "$favicon_folder"
cp -r ./deploy/tools/favicon-generator/output/* "$favicon_folder"