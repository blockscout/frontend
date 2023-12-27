import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'Transaction interpretation';

const provider = getEnvValue('NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER') || 'none';

const config: Feature<{ provider: string }> = (() => {
  if (provider !== 'none') {
    return Object.freeze({
      title,
      provider,
      isEnabled: true,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
