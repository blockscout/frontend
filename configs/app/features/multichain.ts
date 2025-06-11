import type { Feature } from './types';

import apis from '../apis';

const title = 'Interoperability multichain explorer';

const config: Feature<{ }> = (() => {
  if (apis.multichain) {
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
