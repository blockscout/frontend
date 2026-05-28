// SPDX-License-Identifier: LicenseRef-Blockscout

import type { MultichainProviderConfig, MultichainProviderConfigParsed } from 'client/features/multichain-button/types/client';

import marketplace from 'client/features/marketplace/config';

import { getEnvValue, parseEnvJson } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

const value = parseEnvJson<Array<MultichainProviderConfig>>(getEnvValue('NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG'));

const title = 'Multichain balance';

const config: Feature<{ providers: Array<MultichainProviderConfigParsed> }> = (() => {
  if (value) {
    return Object.freeze({
      title,
      isEnabled: true,
      providers: value
        .map((provider) => ({
          name: provider.name,
          logoUrl: provider.logo,
          urlTemplate: provider.url_template,
          dappId: marketplace.isEnabled ? provider.dapp_id : undefined,
          promo: provider.promo,
        }))
        .sort((_, b) => (b.promo ? 1 : -1)),
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
