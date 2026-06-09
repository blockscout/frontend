// SPDX-License-Identifier: LicenseRef-Blockscout

export const SUPPORTED_WALLETS = [
  'metamask',
  'coinbase',
  'token_pocket',
  'rabby',
  'okx',
  'trust',
] as const;

export type WalletType = (typeof SUPPORTED_WALLETS)[number];
