/* eslint-disable no-console */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';
import * as viemChains from 'viem/chains';
import { pick } from 'es-toolkit';

import { EssentialDappsConfig } from 'types/client/marketplace';
import { ChainConfig } from 'types/multichain';
import { getEnvValue, parseEnvJson } from 'configs/app/utils';
import {uniq } from 'es-toolkit';
import currentChainConfig from 'configs/app';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);

async function getChainscoutInfo(externalChainIds: Array<string>, currentChainId: string | undefined) {
  const response = await fetch('https://chains.blockscout.com/api/chains');
  if (!response.ok) {
    throw new Error(`Failed to fetch chains info from Chainscout API`);
  }
  const chainsInfo = await response.json() as Record<string, { explorers: [ { url: string } ], logo: string }>;

  return {
    externals: externalChainIds.map((chainId) => ({
      id: chainId,
      explorerUrl: chainsInfo[chainId]?.explorers[0]?.url,
      logoUrl: chainsInfo[chainId]?.logo,
    })),
    current: currentChainId ? {
      id: currentChainId,
      explorerUrl: chainsInfo[currentChainId]?.explorers[0]?.url,
      logoUrl: chainsInfo[currentChainId]?.logo,
    } : undefined,
  }
}

function getSlug(chainName: string) {
  return chainName.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
}

function trimChainConfig(config: ChainConfig['config'], logoUrl: string | undefined) {
  return {
    ...pick(config, [ 'app', 'chain' ]),
    apis: pick(config.apis || {}, [ 'general' ]),
    UI: {
      navigation: {
        icon: {
          'default': logoUrl,
        }
      },
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

    const chainscoutInfo = await getChainscoutInfo(enabledChains, currentChainConfig.chain.id);
    const chainsWithoutUrl = Object.entries(chainscoutInfo.externals).filter(([_, explorerUrl]) => !explorerUrl);

    if (chainsWithoutUrl.length > 0) {
      console.log(`⚠️  For the following chains explorer url was not found: ${ chainsWithoutUrl.map(([chainId]) => chainId).join(', ') }. Therefore, they will not be enabled.`);
    }
    const explorerUrls = Object.values(chainscoutInfo.externals).map(({ explorerUrl }) => explorerUrl);
    console.log(`ℹ️  For ${ explorerUrls.length } chains explorer url was found in static config. Fetching parameters for each chain...`);

    const chainConfigs = await Promise.all(explorerUrls.map(computeChainConfig)) as Array<ChainConfig['config']>;

    const result = {
      chains: [ currentChainConfig, ...chainConfigs ].map((config, index) => {
        const logoUrl = [...chainscoutInfo.externals, chainscoutInfo.current].find((chain) => chain?.id === config.chain.id)?.logoUrl;
        const chainName = (config as { chain: { name: string } })?.chain?.name ?? `Chain ${ index + 1 }`;
        return {
          slug: getSlug(chainName),
          config: trimChainConfig(config, logoUrl),
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
