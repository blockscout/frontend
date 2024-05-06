import type { Feature } from './types';

import { getEnvValue } from '../utils';

const apiHost = getEnvValue('NEXT_PUBLIC_METADATA_SERVICE_API_HOST');

const title = 'Address metadata';

const config: Feature<{ api: { endpoint: string; basePath: string } }> = (() => {
  if (apiHost) {
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
