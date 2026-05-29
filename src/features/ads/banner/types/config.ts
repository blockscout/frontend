// SPDX-License-Identifier: LicenseRef-Blockscout

export type AdButlerDeviceConfig = {
  id: string;
  width: string;
  height: string;
};

export type AdButlerConfig = {
  config: {
    desktop: AdButlerDeviceConfig;
    mobile: AdButlerDeviceConfig;
  };
};

export const SUPPORTED_AD_BANNER_PROVIDERS = [
  'slise',
  'adbutler',
  'sevio',
  'none',
] as const;
export type AdBannerProviders = (typeof SUPPORTED_AD_BANNER_PROVIDERS)[number];

export const SUPPORTED_AD_BANNER_ADDITIONAL_PROVIDERS = [ 'adbutler' ] as const;
export type AdBannerAdditionalProviders = (typeof SUPPORTED_AD_BANNER_ADDITIONAL_PROVIDERS)[number];
