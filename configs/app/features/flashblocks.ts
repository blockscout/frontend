import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'Flashblocks';

const rpcUrl = getEnvValue('NEXT_PUBLIC_FLASHBLOCKS_RPC_URL');
const socketUrl = getEnvValue('NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL');

const config: Feature<{ rpcUrl: string; socketUrl: string }> = (() => {

  if (rpcUrl && socketUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      rpcUrl,
      socketUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
