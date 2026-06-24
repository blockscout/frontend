// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { SearchResultZetaChainCCTX } from 'src/features/chain-variants/zeta-chain/types/client';
import type * as multichain from 'src/features/multichain/types/client';
import type { SearchResultCluster } from 'src/features/name-services/clusters/types/api';
import type * as api from 'src/slices/search/types/api';

export type SearchResultType = schemas['SearchResultItem']['type'] | 'cluster';

export interface SearchResultFutureBlock {
  type: 'block';
  block_type: 'block';
  block_number: number | string;
  block_hash: string;
  timestamp: undefined;
  url?: string;
}

export type SearchResultBlock = schemas['SearchResultBlock'] | SearchResultFutureBlock;

export type SearchResultItem = api.SearchResultItem |
  SearchResultBlock |
  SearchResultCluster |
  SearchResultZetaChainCCTX;

export type QuickSearchResultItem = multichain.QuickSearchResultItem | SearchResultItem;
