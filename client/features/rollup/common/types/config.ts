// SPDX-License-Identifier: LicenseRef-Blockscout

export const ROLLUP_TYPES = [
  'optimistic',
  'arbitrum',
  'shibarium',
  'zkSync',
  'scroll',
] as const;

export type RollupType = (typeof ROLLUP_TYPES)[number];

export interface ParentChain {
  id?: number;
  name?: string;
  baseUrl: string;
  rpcUrls?: Array<string>;
  currency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet?: boolean;
}
