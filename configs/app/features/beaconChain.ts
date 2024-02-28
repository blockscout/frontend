import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'Beacon chain';

const config: Feature<{ currency: { symbol: string } }> = (() => {
  if (getEnvValue('NEXT_PUBLIC_HAS_BEACON_CHAIN') === 'true') {
    return Object.freeze({
      title,
      isEnabled: true,
      currency: {
        symbol:
          getEnvValue('NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL') ||
          getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL') ||
          '', // maybe we need some other default value here
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
