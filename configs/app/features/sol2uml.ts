import type { Feature } from './types';

import stripTrailingSlash from 'lib/stripTrailingSlash';

import { getEnvValue, getVisualizeApiHost } from '../utils';

const apiEndpoint = getVisualizeApiHost();

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
