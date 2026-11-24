// SPDX-License-Identifier: LicenseRef-Blockscout

import type { operations, schemas } from '@blockscout/api-types';

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
  sort: Exclude<Exclude<operations['TokenController.tokens_list']['params']['query'], undefined>['sort'], undefined>;
  order: Exclude<Exclude<operations['TokenController.tokens_list']['params']['query'], undefined>['order'], undefined>;
}

export type TokensSortingField = TokensSorting['sort'];

export type TokensSortingValue = `${ TokensSortingField }-${ TokensSorting['order'] }` | 'default';
