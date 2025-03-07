import type { Feature } from './types';

import { getEnvValue } from '../utils';

const DEFAULT_URL = `https://raw.githubusercontent.com/blockscout/blockscout-api-v2-swagger/main/swagger.yaml`;
const envValue = getEnvValue('NEXT_PUBLIC_API_SPEC_URL');

const title = 'REST API documentation';

const config: Feature<{ specUrl: string }> = (() => {
  if (envValue === 'none') {
    return Object.freeze({
      title,
      isEnabled: false,
    });
  }

  return Object.freeze({
    title,
    isEnabled: true,
    specUrl: envValue || DEFAULT_URL,
  });
})();

export default config;
