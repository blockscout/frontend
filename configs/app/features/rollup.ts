import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'Rollup (L2) chain';

const config: Feature<{ L1BaseUrl: string; withdrawalUrl: string }> = (() => {
  const L1BaseUrl = getEnvValue(process.env.NEXT_PUBLIC_L1_BASE_URL);
  const withdrawalUrl = getEnvValue(process.env.NEXT_PUBLIC_L2_WITHDRAWAL_URL);

  if (
    getEnvValue(process.env.NEXT_PUBLIC_IS_L2_NETWORK) === 'true' &&
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
