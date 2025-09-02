import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'Celo chain';

const config: Feature<{ nativeTokenAddress?: string }> = (() => {

  if (getEnvValue('NEXT_PUBLIC_CELO_ENABLED') === 'true') {
    return Object.freeze({
      title,
      isEnabled: true,
      nativeTokenAddress: getEnvValue('NEXT_PUBLIC_CELO_NATIVE_TOKEN_ADDRESS'),
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
