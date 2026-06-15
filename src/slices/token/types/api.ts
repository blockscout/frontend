// SPDX-License-Identifier: LicenseRef-Blockscout

import type { merged, schemas } from '@blockscout/api-types';
import type { ExcludeUndefined } from 'src/shared/types/utils';

export type NftTokenType = 'ERC-721' | 'ERC-1155' | 'ERC-404';

// token type can come from the environment config, so it can be any string
export type TokenType = string;

export interface TokenInstanceMetadataSocketMessage {
  token_id: number;
  fetched_metadata: schemas['TokenInstance']['metadata'];
}

export interface TokenInventoryFilters {
  holder_address_hash?: string;
};

export interface TokensFilters {
  q: string;
  type: Array<TokenType> | undefined;
}

export interface TokensBridgedFilters {
  q: string;
  chain_ids: Array<string> | undefined;
}

export interface TokensSorting {
  sort: ExcludeUndefined<ExcludeUndefined<merged.operations['BlockScoutWeb.API.V2.TokenController.tokens_list']['parameters']['query']>['sort']>;
  order: ExcludeUndefined<ExcludeUndefined<merged.operations['BlockScoutWeb.API.V2.TokenController.tokens_list']['parameters']['query']>['order']>;
}

export type TokensSortingField = TokensSorting['sort'];

export type TokensSortingValue = `${ TokensSortingField }-${ TokensSorting['order'] }` | 'default';
