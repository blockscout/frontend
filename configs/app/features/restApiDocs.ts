import type { Feature } from './types';

import { getEnvValue } from '../utils';

const specUrl = getEnvValue('NEXT_PUBLIC_API_SPEC_URL') || `https://raw.githubusercontent.com/blockscout/blockscout-api-v2-swagger/main/swagger.yaml`;

const title = 'REST API documentation';

const config: Feature<{ specUrl: string }> = (() => {
  return Object.freeze({
    title,
    isEnabled: true,
    specUrl,
  });
})();

export default config;
