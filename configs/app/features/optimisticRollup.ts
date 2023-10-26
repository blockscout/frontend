import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'Rollup (L2) chain';

const config: Feature<{ L1BaseUrl: string; withdrawalUrl: string }> = (() => {
  const L1BaseUrl = getEnvValue('NEXT_PUBLIC_L1_BASE_URL');
  const withdrawalUrl = getEnvValue('NEXT_PUBLIC_OPTIMISTIC_L2_WITHDRAWAL_URL');

  if (
    getEnvValue('NEXT_PUBLIC_IS_OPTIMISTIC_L2_NETWORK') === 'true' &&
    L1BaseUrl &&
    withdrawalUrl
  ) {
    return Object.freeze({
      title,
      isEnabled: true,
      L1BaseUrl,
      withdrawalUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
