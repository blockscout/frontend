// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export interface ContractAllowanceType {
  transactionId: `0x${ string }` | null;
  spender: `0x${ string }`;
  allowance?: bigint;
  blockNumber: bigint;
  tokenId?: string;
}

export interface BaseAllowanceType {
  type: 'ERC-20' | 'ERC-721' | 'ERC-1155';
  address: `0x${ string }`;
  transactionId: `0x${ string }` | null;
  tokenId?: string;
  tokenIcon?: string;
  tokenReputation?: schemas['Token']['reputation'] | null;
  allowance?: bigint;
  exchangeRate?: string;
  balance?: bigint;
  valueAtRiskUsd?: number;
  decimals?: number;
  spender: `0x${ string }`;
  symbol?: string;
  name?: string;
  totalSupply?: bigint;
  blockNumber: bigint;
}

export interface AllowanceType extends Omit<
  BaseAllowanceType,
  'allowance' | 'balance' | 'blockNumber' | 'exchangeRate' | 'tokenReputation'
> {
  tokenReputation: schemas['Token']['reputation'] | null;
  allowance?: string;
  price?: string;
  balance?: string;
  spenderName?: string;
  timestamp: number;
}

export interface ApprovalsQueryData {
  items: Array<AllowanceType>;
  total: number;
  totalValueAtRiskUsd: number;
}
