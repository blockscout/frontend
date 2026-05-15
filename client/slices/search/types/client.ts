// SPDX-License-Identifier: LicenseRef-Blockscout

import type { SearchResultZetaChainCCTX } from 'client/features/chain-variants/zeta-chain/types/client';
import type * as api from 'client/slices/search/types/api';
import type * as multichain from 'types/client/multichainAggregator';

export interface SearchResultFutureBlock {
  type: 'block';
  block_type: 'block';
  block_number: number | string;
  block_hash: string;
  timestamp: undefined;
  url?: string;
}

export type SearchResultBlock = api.SearchResultBlock | SearchResultFutureBlock;

export type SearchResultItem = api.SearchResultItem | SearchResultBlock | SearchResultZetaChainCCTX;

export type QuickSearchResultItem = multichain.QuickSearchResultItem | SearchResultItem;
