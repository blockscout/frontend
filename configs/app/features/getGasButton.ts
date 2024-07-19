import type { Feature } from './types';
import type { GasRefuelProviderConfig } from 'types/client/gasRefuelProviderConfig';

import { getEnvValue, parseEnvJson } from '../utils';
import marketplace from './marketplace';

const value = parseEnvJson<GasRefuelProviderConfig>(getEnvValue('NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG'));

const title = 'Get gas button';

const config: Feature<{
  name: string;
  logoUrl?: string;
  urlTemplate: string;
  dappId?: string;
  usdThreshold: number;
}> = (() => {
  if (value) {
    return Object.freeze({
      title,
      isEnabled: true,
      name: value.name,
      logoUrl: value.logo,
      urlTemplate: value.url_template,
      dappId: marketplace.isEnabled ? value.dapp_id : undefined,
      usdThreshold: value.usd_threshold || 1,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
