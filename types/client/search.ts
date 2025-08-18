import type * as api from 'types/api/search';
import type { ZetaChainCCTX } from 'types/api/zetaChain';

export interface SearchResultFutureBlock {
  type: 'block';
  block_type: 'block';
  block_number: number | string;
  block_hash: string;
  timestamp: undefined;
  url?: string; // not used by the frontend, we build the url ourselves
}

export type SearchResultBlock = api.SearchResultBlock | SearchResultFutureBlock;

export interface SearchResultZetaChainCCTX {
  type: 'zetaChainCCTX';
  cctx: ZetaChainCCTX;
}

export type SearchResultItem = api.SearchResultItem | SearchResultBlock | SearchResultZetaChainCCTX;
