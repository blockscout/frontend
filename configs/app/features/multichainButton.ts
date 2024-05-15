import type { Feature } from './types';
import type { MultichainProviderConfig } from 'types/client/multichainProviderConfig';

import { getEnvValue, parseEnvJson } from '../utils';

const value = parseEnvJson<MultichainProviderConfig>(getEnvValue('NEXT_PUBLIC_MULTICHAIN_PROVIDER_CONFIG'));

const title = 'Multichain button';

const config: Feature<{name: string; logoUrl?: string; url_template: string }> = (() => {
  if (value) {
    return Object.freeze({
      title,
      isEnabled: true as const,
      name: value.name,
      logoUrl: value.logo,
      url_template: value.url_template,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
