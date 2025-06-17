import type { Feature } from './types';

import apis from '../apis';
import { getEnvValue } from '../utils';

const isEnabled = getEnvValue('NEXT_PUBLIC_OP_SUPERCHAIN_ENABLED') === 'true';

const title = 'OP Superchain interop explorer';

const config: Feature<{ }> = (() => {
  if (apis.multichain && isEnabled) {
    return Object.freeze({
      title,
      isEnabled: true,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
