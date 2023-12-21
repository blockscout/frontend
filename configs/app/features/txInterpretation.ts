import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'Transaction interpretation';

const config: Feature<{ isEnabled: true }> = (() => {
  if (getEnvValue('NEXT_PUBLIC_TRANSACTION_INTERPRETATION_ENABLED') === 'true') {
    return Object.freeze({
      title,
      isEnabled: true,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
