// SPDX-License-Identifier: LicenseRef-Blockscout

type ArrayElement<ArrType> = ArrType extends ReadonlyArray<infer ElementType> ? ElementType : never;

export const SUPPORTED_WALLETS = [
  'metamask',
  'coinbase',
  'token_pocket',
  'rabby',
  'okx',
  'trust',
] as const;

export type WalletType = ArrayElement<typeof SUPPORTED_WALLETS>;
