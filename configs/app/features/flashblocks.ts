import type { Feature } from './types';

import { getEnvValue } from '../utils';
import megaEthFeature from './megaEth';

const title = 'Flashblocks';

const socketUrl = getEnvValue('NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL');

const config: Feature<{ socketUrl: string; type: 'optimism' | 'megaEth' }> = (() => {
  if (megaEthFeature.isEnabled && megaEthFeature.socketUrl.rpc) {
    return Object.freeze({
      title,
      isEnabled: true,
      socketUrl: megaEthFeature.socketUrl.rpc,
      type: 'megaEth',
    });
  }

  if (socketUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      socketUrl,
      type: 'optimism',
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
