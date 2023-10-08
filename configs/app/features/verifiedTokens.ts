import type { Feature } from './types';

import { getEnvValue } from '../utils';

const contractInfoApiHost = getEnvValue('NEXT_PUBLIC_CONTRACT_INFO_API_HOST');

const title = 'Verified tokens info';

const config: Feature<{ api: { endpoint: string; basePath: string } }> = (() => {
  if (contractInfoApiHost) {
    return Object.freeze({
      title,
      isEnabled: true,
      api: {
        endpoint: contractInfoApiHost,
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
