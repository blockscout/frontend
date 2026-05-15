// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ArrayElement } from 'types/utils';

export const SUPPORTED_AD_BANNER_PROVIDERS = [
  'slise',
  'adbutler',
  'sevio',
  'none',
] as const;
export type AdBannerProviders = ArrayElement<typeof SUPPORTED_AD_BANNER_PROVIDERS>;

export const SUPPORTED_AD_BANNER_ADDITIONAL_PROVIDERS = [ 'adbutler' ] as const;
export type AdBannerAdditionalProviders = ArrayElement<typeof SUPPORTED_AD_BANNER_ADDITIONAL_PROVIDERS>;

export const SUPPORTED_AD_TEXT_PROVIDERS = [ 'sevio', 'none' ] as const;
export type AdTextProviders = ArrayElement<typeof SUPPORTED_AD_TEXT_PROVIDERS>;
