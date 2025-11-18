import type { Feature } from './types';

import apis from '../apis';
import opSuperchain from './opSuperchain';

const title = 'Blockchain statistics';

const config: Feature<{}> = (() => {
  if (apis.stats || opSuperchain.isEnabled) {
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
