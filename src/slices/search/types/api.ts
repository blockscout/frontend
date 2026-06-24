// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { SearchResultTacOperation } from 'src/features/chain-variants/tac/types/api';
import type { SearchResultDomain } from 'src/features/name-services/domains/types/api';

export type SearchResultItem = Exclude<schemas['SearchResultItem'], { type: 'tac_operation' | 'ens_domain' }> |
  SearchResultTacOperation |
  SearchResultDomain;

export type QuickSearchResult = Array<SearchResultItem>;

export interface SearchResult {
  items: Array<SearchResultItem>;
  next_page_params: Record<string, unknown> | null;
}

export interface SearchResultFilters {
  q: string;
}
