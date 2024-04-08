import type { Feature } from './types';

import stripTrailingSlash from 'lib/stripTrailingSlash';

import { getEnvValue } from '../utils';

const apiEndpoint = getEnvValue('NEXT_PUBLIC_VISUALIZE_API_HOST');

const title = 'Solidity to UML diagrams';

const config: Feature<{ api: { endpoint: string; basePath: string } }> = (() => {
  if (apiEndpoint) {
    return Object.freeze({
      title,
      isEnabled: true,
      api: {
        endpoint: apiEndpoint,
        basePath: stripTrailingSlash(getEnvValue('NEXT_PUBLIC_VISUALIZE_API_BASE_PATH') || ''),
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
