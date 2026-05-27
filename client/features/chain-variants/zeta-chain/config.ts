// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from 'client/config/apis';
import { getEnvValue, getExternalAssetFilePath, parseEnvJson } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

const title = 'ZetaChain transactions';

const chainsConfigUrl = getExternalAssetFilePath('NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL');
const externalSearchConfig = parseEnvJson<Array<{ regex: string; template: string; name: string }>>(
  getEnvValue('NEXT_PUBLIC_ZETACHAIN_EXTERNAL_SEARCH_CONFIG'),
);

const config: Feature<{ chainsConfigUrl: string; externalSearchConfig: Array<{ regex: string; template: string; name: string }> }> = (() => {
  if (apis.zetachain && chainsConfigUrl && externalSearchConfig) {
    return Object.freeze({
      title,
      isEnabled: true,
      chainsConfigUrl,
      externalSearchConfig,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
