import type { Feature } from './types';

import chain from '../chain';

// https://docs.safe.global/safe-core-api/available-services
const SAFE_API_MAP: Record<string, string> = {
  '42161': 'https://safe-transaction-arbitrum.safe.global',
  '1313161554': 'https://safe-transaction-aurora.safe.global',
  '43114': 'https://safe-transaction-avalanche.safe.global',
  '8453': 'https://safe-transaction-base.safe.global',
  '84531': 'https://safe-transaction-base-testnet.safe.global',
  '56': 'https://safe-transaction-bsc.safe.global',
  '42220': 'https://safe-transaction-celo.safe.global',
  '1': 'https://safe-transaction-mainnet.safe.global',
  '100': 'https://safe-transaction-gnosis-chain.safe.global',
  '5': 'https://safe-transaction-goerli.safe.global',
  '10': 'https://safe-transaction-optimism.safe.global',
  '137': 'https://safe-transaction-polygon.safe.global',
};

function getApiUrl(): string | undefined {
  if (!chain.id) {
    return;
  }

  const apiHost = SAFE_API_MAP[chain.id];

  if (!apiHost) {
    return;
  }

  return `${ apiHost }/api/v1/safes/`;
}

const title = 'Safe address tags';

const config: Feature<{ apiUrl: string }> = (() => {
  const apiUrl = getApiUrl();

  if (apiUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      apiUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
