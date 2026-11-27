// SPDX-License-Identifier: LicenseRef-Blockscout

import { readFile } from 'node:fs/promises';

import { JSON_CONFIG_FILE_SCHEMAS, validateJsonConfigFile } from './json-configs';

const USAGE_EXIT_CODE = 2;

main();

async function main(): Promise<void> {
  const [ envName, ...filePaths ] = process.argv.slice(2);
  const schema = envName ? JSON_CONFIG_FILE_SCHEMAS[envName] : undefined;

  if (!schema || filePaths.length === 0) {
    console.error('Usage: json-configs-cli <ENV_NAME> <file>...');
    console.error(`Known variables:\n${ Object.keys(JSON_CONFIG_FILE_SCHEMAS).map((name) => `  ${ name }`).join('\n') }`);
    process.exit(USAGE_EXIT_CODE);
  }

  let failedCount = 0;
  for (const filePath of filePaths) {
    const errors = await readFile(filePath, 'utf8')
      .then((content) => validateJsonConfigFile(schema, content))
      .catch((error: unknown) => [ `Unable to read file: ${ error instanceof Error ? error.message : String(error) }` ]);
    if (errors.length > 0) {
      failedCount++;
      console.log(`🚨 ${ filePath }`);
      errors.forEach((error) => console.log(`     ${ error }`));
    }
  }

  console.log(`${ failedCount > 0 ? '🚨' : '👍' } ${ envName }: ${ filePaths.length - failedCount } of ${ filePaths.length } files are valid`);
  process.exit(failedCount > 0 ? 1 : 0);
}
