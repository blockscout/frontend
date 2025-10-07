/* eslint-disable no-console */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

import chainsMap from '../../../configs/essentialDappsChains';

type ChainEnvConfig = {
  envs: Record<string, string>;
};

type OutputChainValue = {
  name: string | undefined;
  icon: string | undefined;
  iconDark: string | undefined;
};

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);

async function fetchChainConfig(url: string): Promise<ChainEnvConfig | null> {
  try {
    const response = await fetch(`${ url }/node-api/config`);
    if (!response.ok) {
      console.error(`   ❌ Failed to fetch config from ${ url }: ${ response.status } ${ response.statusText }`);
      return null;
    }
    const config = await response.json();
    return config as ChainEnvConfig;
  } catch (error) {
    console.error(`   ❌ Error fetching config from ${ url }:`, error);
    return null;
  }
}

async function run() {
  try {
    if (!process.env.NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG) {
      console.log('ℹ️  NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG is not set, skipping essential dapps chains config generation\n');
      return;
    }

    console.log('🌀 Generating essential dapps chains config...');

    const entries = Object.entries(chainsMap as Record<string, string>) as Array<[string, string]>;

    const mappingEntries = await Promise.all(entries.map(async([ id, explorerUrl ]) => {
      console.log('   ⏳ Fetching chain config from:', explorerUrl);
      const cfg = await fetchChainConfig(explorerUrl);
      const envs = cfg?.envs || {};
      const value: OutputChainValue = {
        name: envs.NEXT_PUBLIC_NETWORK_NAME,
        icon: envs.NEXT_PUBLIC_NETWORK_ICON,
        iconDark: envs.NEXT_PUBLIC_NETWORK_ICON_DARK,
      };
      return [ String(id), value ] as const;
    }));

    const chainsData = Object.fromEntries(mappingEntries) as Record<string, OutputChainValue>;

    const outputDir = resolvePath(currentDir, '../../../../public/assets/essential-dapps');
    mkdirSync(outputDir, { recursive: true });

    const outputPathJson = resolvePath(outputDir, 'chains.json');
    writeFileSync(outputPathJson, JSON.stringify(chainsData, null, 2));

    console.log('👍 Done!\n');
  } catch (error) {
    console.error('🚨 Error generating essential dapps chains config:', error);
    console.log('\n');
    process.exit(1);
  }
}

run();
