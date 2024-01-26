import type { Feature } from './types';

import { getExternalAssetFilePath } from '../utils';

// config file will be downloaded at run-time and saved in the public folder
const configUrl = getExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL');

const title = 'Marketplace categories';

const config: Feature<{ configUrl: string }> = (() => {
  if (configUrl) {
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
