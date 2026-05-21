// SPDX-License-Identifier: LicenseRef-Blockscout

export const SUPPORTED_AD_BANNER_PROVIDERS = [
  'slise',
  'adbutler',
  'sevio',
  'none',
] as const;
export type AdBannerProviders = (typeof SUPPORTED_AD_BANNER_PROVIDERS)[number];

export const SUPPORTED_AD_BANNER_ADDITIONAL_PROVIDERS = [ 'adbutler' ] as const;
export type AdBannerAdditionalProviders = (typeof SUPPORTED_AD_BANNER_ADDITIONAL_PROVIDERS)[number];

export const SUPPORTED_AD_TEXT_PROVIDERS = [ 'sevio', 'none' ] as const;
export type AdTextProviders = (typeof SUPPORTED_AD_TEXT_PROVIDERS)[number];
