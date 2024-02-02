import type { Feature } from './types';

import { getEnvValue } from '../utils';

const appUrl = getEnvValue('NEXT_PUBLIC_SWAP_BUTTON_URL');

const title = 'Swap button';

const config: Feature<{ appUrl: string }> = (() => {
  if (appUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      appUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
