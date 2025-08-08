import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'Flashblocks';

const socketUrl = getEnvValue('NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL');

const config: Feature<{ socketUrl: string }> = (() => {

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
