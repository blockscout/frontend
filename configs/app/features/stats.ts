import type { Feature } from './types';

import stripTrailingSlash from 'lib/stripTrailingSlash';

import { getEnvValue, getStatsApiHost } from '../utils';

const apiEndpoint = getStatsApiHost();

const title = 'Blockchain statistics';

const config: Feature<{ api: { endpoint: string; basePath: string } }> = (() => {
  if (apiEndpoint) {
    return Object.freeze({
      title,
      isEnabled: true,
      api: {
        endpoint: apiEndpoint,
        basePath: stripTrailingSlash(getEnvValue('NEXT_PUBLIC_STATS_API_BASE_PATH') || ''),
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
