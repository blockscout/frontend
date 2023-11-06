import type { Feature } from './types';

import { getEnvValue } from '../utils';

const apiEndpoint = getEnvValue('NEXT_PUBLIC_STATS_API_HOST');

const title = 'Blockchain statistics';

const config: Feature<{ api: { endpoint: string; basePath: string } }> = (() => {
  if (apiEndpoint) {
    return Object.freeze({
      title,
      isEnabled: true,
      api: {
        endpoint: apiEndpoint,
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
