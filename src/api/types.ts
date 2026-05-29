// SPDX-License-Identifier: LicenseRef-Blockscout

export type ApiName =
'general' | 'admin' | 'bens' | 'contractInfo' | 'clusters' | 'external' | 'interchainIndexer' |
'metadata' | 'multichainAggregator' | 'multichainStats' | 'rewards' | 'stats' | 'tac' |
'userOps' | 'visualize' | 'zetachain';

export interface ApiResource {
  path: string;
  pathParams?: Array<string>;
  filterFields?: Array<string>;
  paginated?: boolean;
  headers?: RequestInit['headers'];
}

export type IsPaginated<R extends ApiResource> = R extends { paginated: true } ? true : false;
