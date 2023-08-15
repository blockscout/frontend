import type { Feature } from './types';
import type { AdButlerConfig } from 'types/client/adButlerConfig';
import type { AdBannerProviders } from 'types/client/adProviders';

import { getEnvValue, parseEnvJson } from '../utils';

const provider: AdBannerProviders = (() => {
  const envValue = getEnvValue(process.env.NEXT_PUBLIC_AD_BANNER_PROVIDER) as AdBannerProviders;
  const SUPPORTED_AD_BANNER_PROVIDERS: Array<AdBannerProviders> = [ 'slise', 'adbutler', 'coinzilla', 'none' ];

  return envValue && SUPPORTED_AD_BANNER_PROVIDERS.includes(envValue) ? envValue : 'slise';
})();

const title = 'Banner ads';

type AdsBannerFeaturePayload = {
  provider: Exclude<AdBannerProviders, 'adbutler' | 'none'>;
} | {
  provider: 'adbutler';
  adButler: {
    config: {
      desktop: AdButlerConfig;
      mobile: AdButlerConfig;
    };
  };
}

const config: Feature<AdsBannerFeaturePayload> = (() => {
  if (provider === 'adbutler') {
    const desktopConfig = parseEnvJson<AdButlerConfig>(getEnvValue(process.env.NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP));
    const mobileConfig = parseEnvJson<AdButlerConfig>(getEnvValue(process.env.NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE));

    if (desktopConfig && mobileConfig) {
      return Object.freeze({
        title,
        isEnabled: true,
        provider,
        adButler: {
          config: {
            desktop: desktopConfig,
            mobile: mobileConfig,
          },
        },
      });
    }
  } else if (provider !== 'none') {
    return Object.freeze({
      title,
      isEnabled: true,
      provider,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
