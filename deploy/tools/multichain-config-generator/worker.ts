/* eslint-disable no-console */
import { parentPort, workerData } from 'node:worker_threads';

interface WorkerData {
  url: string;
}

interface ChainConfig {
  envs: Record<string, string>;
}

async function fetchChainConfig(url: string): Promise<ChainConfig> {
  const response = await fetch(`${ url }/node-api/config`);
  if (!response.ok) {
    throw new Error(`Failed to fetch config from ${ url }: ${ response.statusText }`);
  }
  const config = await response.json();
  return config as ChainConfig;
}

async function computeConfig() {
  try {
    const { url } = workerData as WorkerData;
    console.log('   ⏳ Fetching chain config from:', url);

    // 1. Fetch chain config
    const chainConfig = await fetchChainConfig(url);

    // 2. Set environment variables
    Object.entries(chainConfig.envs).forEach(([ key, value ]) => {
      // eslint-disable-next-line no-restricted-properties
      process.env[key] = value;
    });

    // 3. Import and compute app config
    const { 'default': appConfig } = await import('configs/app/index');

    console.log('   ✅ Config computed for:', url);

    // 4. Send config back to main thread
    parentPort?.postMessage(appConfig);
  } catch (error) {
    console.error('   ❌ Worker error:', error);
    process.exit(1);
  }
}

computeConfig();
