import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'ZkEVM rollup (L2) chain';

const config: Feature<{ L1BaseUrl: string; withdrawalUrl?: string }> = (() => {
  const L1BaseUrl = getEnvValue('NEXT_PUBLIC_L1_BASE_URL');
  const isZkEvm = getEnvValue('NEXT_PUBLIC_IS_ZKEVM_L2_NETWORK') === 'true';

  if (isZkEvm && L1BaseUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      L1BaseUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
