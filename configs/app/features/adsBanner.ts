import type { Feature } from './types';
import type { AdButlerConfig, AdBannerProviders } from 'types/client/ad';
import { SUPPORTED_AD_BANNER_PROVIDERS } from 'types/client/ad';

import { getEnvValue, getExternalAssetFilePath, parseEnvJson } from '../utils';

const provider: AdBannerProviders = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_AD_BANNER_PROVIDER') as AdBannerProviders;

  return envValue && SUPPORTED_AD_BANNER_PROVIDERS.includes(envValue) ? envValue : 'slise';
})();

const title = 'Banner ads';

type AdsBannerFeaturePayload = {
  provider: Exclude<AdBannerProviders, 'adbutler' | 'custom' | 'none'>;
} | {
  provider: 'adbutler';
  adButler: {
    config: {
      desktop: AdButlerConfig;
      mobile: AdButlerConfig;
    };
  };
} | {
  provider: 'custom';
  configUrl: string;
}

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
  } else if (provider === 'custom') {
    const configUrl = getExternalAssetFilePath('NEXT_PUBLIC_AD_CUSTOM_CONFIG_URL');
    if (configUrl) {
      return Object.freeze({
        title,
        isEnabled: true,
        provider,
        configUrl,
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
