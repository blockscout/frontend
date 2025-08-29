import type { Feature } from './types';

import chain from '../chain';
import { getEnvValue } from '../utils';

const title = 'Beacon chain';

const config: Feature<{ currency: { symbol: string } }> = (() => {
  if (getEnvValue('NEXT_PUBLIC_HAS_BEACON_CHAIN') === 'true') {
    return Object.freeze({
      title,
      isEnabled: true,
      currency: {
        symbol:
          chain.currency.symbol ||
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
