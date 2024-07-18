import type * as api from 'types/api/search';

export interface SearchResultFutureBlock {
  type: 'block';
  block_type: 'block';
  block_number: number | string;
  block_hash: string;
  timestamp: undefined;
  url?: string; // not used by the frontend, we build the url ourselves
}

export type SearchResultBlock = api.SearchResultBlock | SearchResultFutureBlock;

export type SearchResultItem = api.SearchResultItem | SearchResultBlock;
