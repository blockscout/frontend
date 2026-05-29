// SPDX-License-Identifier: LicenseRef-Blockscout

export const VALIDATORS_CHAIN_TYPE = [
  'stability',
  'blackfort',
  'zilliqa',
] as const;

export type ValidatorsChainType = (typeof VALIDATORS_CHAIN_TYPE)[number];
