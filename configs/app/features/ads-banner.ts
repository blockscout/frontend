// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Feature } from './types';
import type { AdButlerConfig, AdButlerDeviceConfig } from 'types/client/adButlerConfig';
import { SUPPORTED_AD_BANNER_PROVIDERS } from 'types/client/adProviders';
import type { AdBannerProviders, AdBannerAdditionalProviders } from 'types/client/adProviders';

import app from '../app';
import { getEnvValue, parseEnvJson } from '../utils';

const SEVIO_ZONE_MOBILE = '52909312-7ebb-4bd5-9006-5e4f7041ed63';
const SEVIO_ZONE_DESKTOP = '07cabd45-77f1-4203-8081-868bae776981';
const SEVIO_INVENTORY_ID = '65597ae2-67b8-404b-ac28-43d5029389da';
const SEVIO_ACCOUNT_ID = 'e08c2e1e-2213-49d8-a397-c2e32094fba4';
const SEVIO_AD_TYPE = 'banner';

interface SevioConfig {
  readonly zoneMobile: string;
  readonly zoneDesktop: string;
  readonly inventoryId: string;
  readonly accountId: string;
  readonly adType: string;
}

const provider: AdBannerProviders = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_AD_BANNER_PROVIDER') as AdBannerProviders;
  return envValue && SUPPORTED_AD_BANNER_PROVIDERS.includes(envValue) ? envValue : 'slise';
})();

const additionalProvider = getEnvValue('NEXT_PUBLIC_AD_BANNER_ADDITIONAL_PROVIDER') as AdBannerAdditionalProviders;
const isSpecifyEnabled = getEnvValue('NEXT_PUBLIC_AD_BANNER_ENABLE_SPECIFY') === 'true';

const sevioZones = parseEnvJson<Array<string>>(getEnvValue('NEXT_PUBLIC_AD_BANNER_SEVIO_ZONES'));
const sevioConfig: SevioConfig = {
  zoneMobile: sevioZones?.[0] || SEVIO_ZONE_MOBILE,
  zoneDesktop: sevioZones?.[1] || SEVIO_ZONE_DESKTOP,
  inventoryId: SEVIO_INVENTORY_ID,
  accountId: SEVIO_ACCOUNT_ID,
  adType: SEVIO_AD_TYPE,
};

const adButlerDesktopConfig = parseEnvJson<AdButlerDeviceConfig>(getEnvValue('NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP'));
const adButlerMobileConfig = parseEnvJson<AdButlerDeviceConfig>(getEnvValue('NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE'));
const adButlerConfig: AdButlerConfig | null = adButlerDesktopConfig && adButlerMobileConfig ? {
  config: {
    desktop: adButlerDesktopConfig,
    mobile: adButlerMobileConfig,
  },
} : null;

const title = 'Banner ads';

type AdsBannerFeatureProviderPayload = {
  provider: 'slise';
} | {
  provider: 'sevio';
  sevio: SevioConfig;
} | {
  provider: 'adbutler';
  adButler: AdButlerConfig;
} | {
  provider: 'slise';
  additionalProvider: 'adbutler';
  adButler: AdButlerConfig;
} | {
  provider: 'sevio';
  additionalProvider: 'adbutler';
  sevio: SevioConfig;
  adButler: AdButlerConfig;
};

type AdsBannerFeaturePayload = AdsBannerFeatureProviderPayload & {
  isSpecifyEnabled: boolean;
};

const config: Feature<AdsBannerFeaturePayload> = (() => {
  if (app.isPrivateMode) {
    return Object.freeze({
      title,
      isEnabled: false,
    });
  }

  if (provider === 'adbutler' && adButlerConfig) {
    return Object.freeze({
      title,
      isEnabled: true,
      provider,
      adButler: adButlerConfig,
      isSpecifyEnabled,
    });
  }

  if (provider !== 'none' && additionalProvider === 'adbutler' && adButlerConfig) {
    if (provider === 'sevio') {
      return Object.freeze({
        title,
        isEnabled: true,
        provider,
        additionalProvider,
        sevio: sevioConfig,
        adButler: adButlerConfig,
        isSpecifyEnabled,
      });
    }

    return Object.freeze({
      title,
      isEnabled: true,
      provider,
      additionalProvider,
      adButler: adButlerConfig,
      isSpecifyEnabled,
    });
  }

  if (provider === 'sevio') {
    return Object.freeze({
      title,
      isEnabled: true,
      provider,
      sevio: sevioConfig,
      isSpecifyEnabled,
    });
  }

  if (provider === 'slise') {
    return Object.freeze({
      title,
      isEnabled: true,
      provider,
      isSpecifyEnabled,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
