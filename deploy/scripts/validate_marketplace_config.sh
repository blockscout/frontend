yarn ts-to-zod ./types/client/apps.ts ./tools/marketplace-config-validator/schema.ts
yarn tsc -p ./tools/marketplace-config-validator/tsconfig.json
node ./tools/marketplace-config-validator/index.js