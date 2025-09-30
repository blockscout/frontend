import type { Feature } from './types';

import chain from '../chain';
import { getEnvValue } from '../utils';

const title = 'Beacon chain';

const config: Feature<{ currency: { symbol: string }; validatorUrlTemplate: string | undefined }> = (() => {
  if (getEnvValue('NEXT_PUBLIC_HAS_BEACON_CHAIN') === 'true') {
    const validatorUrlTemplate = getEnvValue('NEXT_PUBLIC_BEACON_CHAIN_VALIDATOR_URL_TEMPLATE');
    return Object.freeze({
      title,
      isEnabled: true,
      currency: {
        symbol:
          chain.currency.symbol ||
          '', // maybe we need some other default value here
      },
      validatorUrlTemplate,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
