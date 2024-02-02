import type { Feature } from './types';

import chain from '../chain';
import { getEnvValue, getExternalAssetFilePath } from '../utils';

// config file will be downloaded at run-time and saved in the public folder
const configUrl = getExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL');
const submitFormUrl = getEnvValue('NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM');
const categoriesUrl = getExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL');

const title = 'Marketplace';

const config: Feature<{ configUrl: string; submitFormUrl: string; categoriesUrl: string | undefined }> = (() => {
  if (
    chain.rpcUrl &&
    configUrl &&
    submitFormUrl
  ) {
    return Object.freeze({
      title,
      isEnabled: true,
      configUrl,
      submitFormUrl,
      categoriesUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
