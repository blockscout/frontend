import type { Feature } from './types';

import { getEnvValue } from '../utils';

const hostApiKey = getEnvValue('NEXT_PUBLIC_RAMP_HOST_API_KEY');

const title = 'Ramp Integration';

const config: Feature<{ hostApiKey: string; defaultAsset?: string }> = (() => {
  if (hostApiKey) {
    return Object.freeze({
      title,
      isEnabled: true,
      hostApiKey,
      defaultAsset: getEnvValue('NEXT_PUBLIC_RAMP_DEFAULT_ASSET'),
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
