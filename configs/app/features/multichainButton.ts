import type { Feature } from './types';
import type { MultichainProviderConfig } from 'types/client/multichainProviderConfig';

import { getEnvValue, parseEnvJson } from '../utils';
import marketplace from './marketplace';

const value = parseEnvJson<MultichainProviderConfig>(getEnvValue('NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG'));

const title = 'Multichain balance';

const config: Feature<{name: string; logoUrl?: string; urlTemplate: string; dappId?: string }> = (() => {
  if (value) {
    return Object.freeze({
      title,
      isEnabled: true,
      name: value.name,
      logoUrl: value.logo,
      urlTemplate: value.url_template,
      dappId: marketplace.isEnabled ? value.dapp_id : undefined,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
