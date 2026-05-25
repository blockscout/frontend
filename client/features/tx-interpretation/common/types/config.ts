// SPDX-License-Identifier: LicenseRef-Blockscout

export const PROVIDERS = [
  'blockscout',
  'noves',
  'none',
] as const;

export type Provider = (typeof PROVIDERS)[number];
