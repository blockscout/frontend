import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);

// const EXPLORER_URLS = [
//   'https://optimism.blockscout.com',
//   'https://base.blockscout.com',
//   'https://arbitrum.blockscout.com',
//   'https://unichain.blockscout.com',
//   'https://explorer.redstone.xyz',
//   'https://matchscan.io'
//   // 'https://optimism-interop-alpha-0.blockscout.com',
//   // 'https://optimism-interop-alpha-1.blockscout.com',
// ];

function getSlug(chainName: string) {
  return chainName.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
}

async function computeChainConfig(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const workerPath = resolvePath(currentDir, 'worker.js');

    const worker = new Worker(workerPath, {
      workerData: { url },
      env: {} // Start with empty environment
    });

    worker.on('message', (config) => {
      resolve(config);
    });

    worker.on('error', (error) => {
      console.error('Worker error:', error);
      reject(error);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${ code }`));
      }
    });
  });
}

async function getExplorerUrls() {
  try {
    const basePath = (process.env.NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_BASE_PATH ?? '') + '/chains';
    const url = new URL(basePath, process.env.NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST);

    const response = await fetch(url.toString());
    const data = await response.json();

    console.log(`💡 Found ${ data.items.length } chains in cluster.`);

    return data.items.map((item: { explorer_url: string }) => item.explorer_url);
  } catch (error) {
    return [];
  }
}

async function run() {
  try {
    if (!process.env.NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST) {
      console.log('ℹ️  NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST is not set, skipping multichain config generation\n');
      return;
    }

    console.log('🌀 Generating multichain config...');

    const explorerUrls = await getExplorerUrls();

    if (!explorerUrls.length) {
      throw new Error('No chains found in the cluster.');
    }

    const configs = await Promise.all(explorerUrls.map(computeChainConfig));

    const config = {
      chains: configs.map((config, index) => {
        const chainName = (config as { chain: { name: string } })?.chain?.name ?? `Chain ${ index + 1 }`;
        return {
          slug: getSlug(chainName),
          config,
        };
      }),
    };

    const outputDir = resolvePath(currentDir, '../../../../public/assets/multichain');
    mkdirSync(outputDir, { recursive: true });

    const outputPathJson = resolvePath(outputDir, 'config.json');
    writeFileSync(outputPathJson, JSON.stringify(config, null, 2));

    const outputPathJs = resolvePath(outputDir, 'config.js');
    writeFileSync(outputPathJs, `window.__multichainConfig = ${ JSON.stringify(config) };`);

    console.log('👍 Done!\n');
  } catch (error) {
    console.error('🚨 Error generating multichain config:', error);
    console.log('\n');
    process.exit(1);
  }
}

run();
