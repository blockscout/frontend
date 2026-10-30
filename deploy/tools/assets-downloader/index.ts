// SPDX-License-Identifier: LicenseRef-Blockscout

import { DEFAULT_RETRY_DELAY, downloadAssets } from './download';

main();

async function main(): Promise<void> {
  const assetsDir = process.argv[2];
  if (!assetsDir || process.argv.length !== 3) {
    console.log('🛑 Error: incorrect amount of arguments. Usage: node index.js <ASSETS_DIR>.');
    process.exit(1);
  }

  console.log('');
  console.log('⬇️  Downloading external assets...');

  try {
    const report = await downloadAssets({
      envs: process.env,
      assetsDir,
      fetch: globalThis.fetch,
      retryDelay: DEFAULT_RETRY_DELAY,
      log: console.log,
    });
    if (report.failed.length > 0) {
      console.log(`🛑 Error: ${ report.failed.length } asset download(s) failed. The application cannot start.`);
      process.exit(1);
    }
    console.log('✅ Done.');
    console.log('');
  } catch (error) {
    console.log('🚨 Unexpected error occurred while downloading assets.');
    console.error(error);
    process.exit(1);
  }
}
