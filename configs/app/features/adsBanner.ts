import type { Feature } from './types';
import type { AdButlerConfig } from 'types/client/adButlerConfig';
import { SUPPORTED_AD_BANNER_PROVIDERS } from 'types/client/adProviders';
import type { AdBannerProviders, AdBannerAdditionalProviders } from 'types/client/adProviders';

import { getEnvValue, parseEnvJson } from '../utils';

const provider: AdBannerProviders = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_AD_BANNER_PROVIDER') as AdBannerProviders;

  return envValue && SUPPORTED_AD_BANNER_PROVIDERS.includes(envValue) ? envValue : 'slise';
})();

const additionalProvider = getEnvValue('NEXT_PUBLIC_AD_BANNER_ADDITIONAL_PROVIDER') as AdBannerAdditionalProviders;

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
} | {
  provider: Exclude<AdBannerProviders, 'adbutler' | 'none'>;
  additionalProvider: 'adbutler';
  adButler: {
    config: {
      desktop: AdButlerConfig;
      mobile: AdButlerConfig;
    };
  };
};

const config: Feature<AdsBannerFeaturePayload> = (() => {
  if (provider === 'adbutler') {
    const desktopConfig = parseEnvJson<AdButlerConfig>(getEnvValue('NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP'));
    const mobileConfig = parseEnvJson<AdButlerConfig>(getEnvValue('NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE'));

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

    if (additionalProvider === 'adbutler') {
      const desktopConfig = parseEnvJson<AdButlerConfig>(getEnvValue('NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP'));
      const mobileConfig = parseEnvJson<AdButlerConfig>(getEnvValue('NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE'));

      return Object.freeze({
        title,
        isEnabled: true,
        provider,
        additionalProvider,
        adButler: {
          config: {
            desktop: desktopConfig,
            mobile: mobileConfig,
          },
        },
      });
    }
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
