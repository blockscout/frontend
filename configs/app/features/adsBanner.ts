import type { AdButlerConfig } from 'types/client/adButlerConfig';
import type { AdBannerProviders } from 'types/client/adProviders';

import { getEnvValue, parseEnvJson } from '../utils';

const provider: AdBannerProviders = (() => {
  const envValue = getEnvValue(process.env.NEXT_PUBLIC_AD_BANNER_PROVIDER) as AdBannerProviders;
  const SUPPORTED_AD_BANNER_PROVIDERS: Array<AdBannerProviders> = [ 'slise', 'adbutler', 'coinzilla', 'none' ];

  return envValue && SUPPORTED_AD_BANNER_PROVIDERS.includes(envValue) ? envValue : 'slise';
})();

export default Object.freeze({
  title: 'Banner ads',
  isEnabled: provider !== 'none',
  provider,
  adButler: {
    config: {
      desktop: parseEnvJson<AdButlerConfig>(getEnvValue(process.env.NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP)) ?? undefined,
      mobile: parseEnvJson<AdButlerConfig>(getEnvValue(process.env.NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE)) ?? undefined,
    },
  },
});
