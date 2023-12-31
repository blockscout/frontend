import type { Feature } from './types';

import { getEnvValue } from '../utils';

const novesEnabled = getEnvValue('NEXT_PUBLIC_NOVES_ENABLED') === 'true';

const title = 'Noves API';

const config: Feature<{ isEnabled: true }> = (() => {
  if (novesEnabled) {
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
