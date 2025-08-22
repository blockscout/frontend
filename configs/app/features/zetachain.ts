import type { Feature } from './types';

import apis from '../apis';
import { getEnvValue, getExternalAssetFilePath } from '../utils';

const title = 'ZetaChain transactions';

const chainsConfigUrl = getExternalAssetFilePath('NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL');
const cosmosTxUrlTemplate = getEnvValue('NEXT_PUBLIC_ZETACHAIN_COSMOS_TX_URL_TEMPLATE');
const cosmosAddressUrlTemplate = getEnvValue('NEXT_PUBLIC_ZETACHAIN_COSMOS_ADDRESS_URL_TEMPLATE');

const config: Feature<{ chainsConfigUrl: string; cosmosTxUrlTemplate: string; cosmosAddressUrlTemplate: string }> = (() => {
  if (apis.zetachain && chainsConfigUrl && cosmosTxUrlTemplate && cosmosAddressUrlTemplate) {
    return Object.freeze({
      title,
      isEnabled: true,
      chainsConfigUrl,
      cosmosTxUrlTemplate,
      cosmosAddressUrlTemplate,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
