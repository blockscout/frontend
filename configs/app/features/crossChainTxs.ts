import type { Feature } from './types';

import apis from '../apis';
import { getExternalAssetFilePath } from '../utils';

const configUrl = getExternalAssetFilePath('NEXT_PUBLIC_CROSS_CHAIN_TXS_CONFIG');

const title = 'Cross-chain transactions';

const config: Feature<{ configUrl: string }> = (() => {
  if (apis.interchainIndexer && configUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      configUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
