import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'MegaETH chain';

const config: Feature<{ socketUrl: string }> = (() => {
  const socketUrl = getEnvValue('NEXT_PUBLIC_MEGA_ETH_SOCKET_URL');

  if (socketUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      socketUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
