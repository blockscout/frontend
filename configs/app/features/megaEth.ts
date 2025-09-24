import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'MegaETH chain';

const config: Feature<{ socketUrl: { metrics: string } }> = (() => {
  const socketUrlMetrics = getEnvValue('NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_METRICS');

  if (socketUrlMetrics) {
    return Object.freeze({
      title,
      isEnabled: true,
      socketUrl: {
        metrics: socketUrlMetrics,
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
