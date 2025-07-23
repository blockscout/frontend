import type { Feature } from './types';

import apis from '../apis';
import { getExternalAssetFilePath } from '../utils';

const title = 'ZetaChain transactions';

const chainsConfigUrl = getExternalAssetFilePath('NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL');

const config: Feature<{ chainsConfigUrl: string }> = (() => {
  if (apis.zetachain && chainsConfigUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      chainsConfigUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
