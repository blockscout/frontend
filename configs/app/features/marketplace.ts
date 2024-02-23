import type { Feature } from './types';

import chain from '../chain';
import { getEnvValue, getExternalAssetFilePath } from '../utils';

// config file will be downloaded at run-time and saved in the public folder
const enabled = getEnvValue('NEXT_PUBLIC_MARKETPLACE_ENABLED');
const configUrl = getExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL');
const submitFormUrl = getEnvValue('NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM');
const suggestIdeasFormUrl = getEnvValue('NEXT_PUBLIC_MARKETPLACE_SUGGEST_IDEAS_FORM');
const categoriesUrl = getExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL');
const adminServiceApiHost = getEnvValue('NEXT_PUBLIC_ADMIN_SERVICE_API_HOST');

const title = 'Marketplace';

const config: Feature<(
  { configUrl: string } |
  { api: { endpoint: string; basePath: string } }
) & { submitFormUrl: string; categoriesUrl: string | undefined; suggestIdeasFormUrl: string | undefined }
> = (() => {
  if (enabled === 'true' && chain.rpcUrl && submitFormUrl) {
    if (configUrl) {
      return Object.freeze({
        title,
        isEnabled: true,
        configUrl,
        submitFormUrl,
        categoriesUrl,
        suggestIdeasFormUrl,
      });
    } else if (adminServiceApiHost) {
      return Object.freeze({
        title,
        isEnabled: true,
        submitFormUrl,
        categoriesUrl,
        suggestIdeasFormUrl,
        api: {
          endpoint: adminServiceApiHost,
          basePath: '',
        },
      });
    }
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
