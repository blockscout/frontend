import type { Feature } from './types';

import apis from '../apis';

const title = 'Cross-chain transactions';

const config: Feature<{}> = (() => {
  if (apis.interchainIndexer) {
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
