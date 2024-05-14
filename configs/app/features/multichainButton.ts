import type { Feature } from './types';
import type { MultichainProviderConfig } from 'types/client/multichainProviderConfig';

import { getEnvValue, parseEnvJson } from '../utils';
import marketplace from './marketplace';

const value = parseEnvJson<MultichainProviderConfig>(getEnvValue('NEXT_PUBLIC_MULTICHAIN_PROVIDER_CONFIG'));

const title = 'Multichain button';

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
}

const config: Feature<{name: string; logoUrl?: string } & ({ dappId: string } | { url: string })> = (() => {
  if (value) {
    const enabledOptions = {
      title,
      isEnabled: true as const,
      name: value.name,
      logoUrl: value.logo,
    };
    if (isValidUrl(value.url)) {
      return Object.freeze({
        ...enabledOptions,
        url: value.url,
      });
    } else if (marketplace.isEnabled) {
      return Object.freeze({
        ...enabledOptions,
        dappId: value.url,
      });
    }
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
