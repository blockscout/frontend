// SPDX-License-Identifier: LicenseRef-Blockscout

export const SUPPORTED_AD_TEXT_PROVIDERS = [ 'sevio', 'none' ] as const;
export type AdTextProviders = (typeof SUPPORTED_AD_TEXT_PROVIDERS)[number];
