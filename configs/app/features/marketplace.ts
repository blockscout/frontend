import type { Feature } from './types';

import chain from '../chain';
import { getEnvValue, getExternalAssetFilePath } from '../utils';

// config file will be downloaded at run-time and saved in the public folder
const configUrl = getExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL');
const submitFormUrl = getEnvValue('NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM');
const categoriesUrl = getExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL');
const adminServiceApiHost = getEnvValue('NEXT_PUBLIC_ADMIN_SERVICE_API_HOST');

const title = 'Marketplace';

const config: Feature<{
  configUrl: string | undefined;
  submitFormUrl: string;
  categoriesUrl: string | undefined;
  api: { endpoint: string; basePath: string } | undefined;
}> = (() => {
  if (
    chain.rpcUrl &&
    (configUrl || adminServiceApiHost) &&
    submitFormUrl
  ) {
    return Object.freeze({
      title,
      isEnabled: true,
      configUrl: adminServiceApiHost ? undefined : configUrl,
      submitFormUrl,
      categoriesUrl,
      api: adminServiceApiHost ? {
        endpoint: adminServiceApiHost,
        basePath: '',
      } : undefined,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
