import type { Feature } from './types';

import { getEnvValue } from '../utils';

const clientKey = getEnvValue('NEXT_PUBLIC_GROWTH_BOOK_CLIENT_KEY');

const title = 'GrowthBook feature flagging and A/B testing';

const config: Feature<{ clientKey: string }> = (() => {
  if (clientKey) {
    return Object.freeze({
      title,
      isEnabled: true,
      clientKey,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
