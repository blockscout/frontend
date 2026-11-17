// SPDX-License-Identifier: LicenseRef-Blockscout

import type React from 'react';

import type { AddressFormat } from 'src/slices/address/types/config';
import type { SearchResultItem } from 'src/slices/search/types/client';

import type { SearchResultAppItem } from 'src/slices/search/utils/search-categories';

export type SearchResultRowItem = SearchResultItem | SearchResultAppItem;

export type SearchResultRowItemOfType<TType extends SearchResultRowItem['type']> = Extract<SearchResultRowItem, { type: TType }>;

export interface SearchResultCellsProps<TType extends SearchResultRowItem['type']> {
  readonly data: SearchResultRowItemOfType<TType>;
  readonly searchTerm: string;
  readonly isLoading: boolean | undefined;
  readonly addressFormat: AddressFormat | undefined;
  readonly onLinkClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}
