/* eslint-disable no-console */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';
import * as viemChains from 'viem/chains';
import { pick } from 'es-toolkit';

import chainsMap from '../../../configs/essentialDappsChains';
import { EssentialDappsConfig } from 'types/client/marketplace';
import { ChainConfig } from 'types/multichain';
import { getEnvValue, parseEnvJson } from 'configs/app/utils';
import { difference, uniq } from 'es-toolkit';
import currentChainConfig from 'configs/app';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);

function getSlug(chainName: string) {
  return chainName.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
}

function trimChainConfig(config: ChainConfig['config']) {
  return {
    ...pick(config, [ 'app', 'chain' ]),
    apis: pick(config.apis || {}, [ 'general' ]),
    UI: {
      navigation: pick(config.UI.navigation || {}, [ 'icon' ]),
    }
  };
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

async function run() {
  try {
    if (!process.env.NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG) {
      console.log('ℹ️  NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG is not set, skipping essential dapps chains config generation\n');
      return;
    }

    console.log('🌀 Generating essential dapps chains config...');

    const featureConfig = parseEnvJson<EssentialDappsConfig>(getEnvValue('NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG'));
    const enabledChains = uniq([
      ...Object.values(featureConfig?.swap?.chains ?? []),
      ...Object.values(featureConfig?.revoke?.chains ?? []),
      ...Object.values(featureConfig?.multisend?.chains ?? []),
    ].filter((chain) => chain !== currentChainConfig.chain.id))

    if (enabledChains.length === 0) {
      console.log('⚠️  No chains are enabled. Skipping essential dapps chains config generation.\n');
      return;
    }

    // TODO @tom2drum get chain url for chainscout
    const chainsWithExplorerUrls = Object.keys(chainsMap).filter((key) => enabledChains.includes(key));
    const chainsDiff = difference(enabledChains, chainsWithExplorerUrls);
    const explorerUrls = chainsWithExplorerUrls.map((key) => chainsMap[key]);

    if (chainsDiff.length > 0) {
      console.log(`⚠️  For the following chains explorer url was not found: ${ chainsDiff.join(', ') }. Therefore, they will not be enabled.`);
    }
    console.log(`ℹ️  For ${ explorerUrls.length } chains explorer url was found in static config. Fetching parameters for each chain...`);

    const chainConfigs = await Promise.all(explorerUrls.map(computeChainConfig)) as Array<ChainConfig['config']>;

    const result = {
      chains: [ currentChainConfig, ...chainConfigs ].map((config, index) => {
        const chainName = (config as { chain: { name: string } })?.chain?.name ?? `Chain ${ index + 1 }`;
        return {
          slug: getSlug(chainName),
          config: trimChainConfig(config),
          contracts: Object.values(viemChains).find(({ id }) => id === Number(config.chain.id))?.contracts
        };
      }),
    };
    
    const outputDir = resolvePath(currentDir, '../../../../public/assets/essential-dapps');
    mkdirSync(outputDir, { recursive: true });
    
    const outputPathJson = resolvePath(outputDir, 'chains.json');
    writeFileSync(outputPathJson, JSON.stringify(result, null, 2));

    const outputPathJs = resolvePath(outputDir, 'chains.js');
    writeFileSync(outputPathJs, `window.__essentialDappsChains = ${ JSON.stringify(result) };`);

    console.log('👍 Done!\n');
  } catch (error) {
    console.error('🚨 Error generating essential dapps chains config:', error);
    console.log('\n');
    process.exit(1);
  }
}

run();
