// SPDX-License-Identifier: LicenseRef-Blockscout

import type { MultichainProviderConfig } from 'src/features/multichain-button/types/client';

import marketplace from 'src/features/marketplace/config';

import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const value = parseEnvJson<Array<MultichainProviderConfig>>(getEnvValue('NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG'));

const title = 'Multichain balance';

const config: Feature<{ providers: Array<MultichainProviderConfig> }> = (() => {
  if (value) {
    return Object.freeze({
      title,
      isEnabled: true,
      providers: value.map((provider) => ({
        name: provider.name,
        logo: provider.logo,
        url_template: provider.url_template,
        dapp_id: marketplace.isEnabled ? provider.dapp_id : undefined,
        view: provider.view,
      })),
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
