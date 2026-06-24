// SPDX-License-Identifier: LicenseRef-Blockscout

import { formatUnits } from 'viem';

import type { schemas } from '@blockscout/api-types';

export type TokenBalanceInfo = {
  balance?: bigint;
  exchangeRate?: string;
  decimals?: number;
  symbol?: string;
  name?: string;
  tokenIcon?: string;
  tokenReputation?: schemas['Token']['reputation'] | null;
  totalSupply?: bigint;
};

export function getValueAtRiskUsd(allowance: bigint, tokenInfo: TokenBalanceInfo | undefined): number | undefined {
  if (!tokenInfo?.balance || !tokenInfo.exchangeRate || tokenInfo.decimals === undefined) {
    return;
  }

  const valueAtRisk = allowance > tokenInfo.balance ? tokenInfo.balance : allowance;

  return parseFloat(formatUnits(valueAtRisk, tokenInfo.decimals)) * parseFloat(tokenInfo.exchangeRate);
}
