import type { Feature } from './types';

import { getEnvValue } from '../utils';

const specUrl = getEnvValue(process.env.NEXT_PUBLIC_API_SPEC_URL);

const title = 'REST API documentation';

const config: Feature<{ specUrl: string }> = (() => {
  if (specUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      specUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
