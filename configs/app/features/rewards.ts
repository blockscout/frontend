import type { Feature } from './types';

import { getEnvValue } from '../utils';
import account from './account';
import blockchainInteraction from './blockchainInteraction';

const apiHost = getEnvValue('NEXT_PUBLIC_REWARDS_SERVICE_API_HOST');

const title = 'Rewards service integration';

const config: Feature<{ api: { endpoint: string; basePath: string } }> = (() => {
  if (apiHost && account.isEnabled && blockchainInteraction.isEnabled) {
    return Object.freeze({
      title,
      isEnabled: true,
      api: {
        endpoint: apiHost,
        basePath: '',
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
