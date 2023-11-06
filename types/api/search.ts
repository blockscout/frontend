import type { TokenType } from 'types/api/token';

export type SearchResultType = 'token' | 'address' | 'block' | 'transaction' | 'contract';

export interface SearchResultToken {
  type: 'token';
  name: string;
  symbol: string;
  address: string;
  token_url: string;
  address_url: string;
  icon_url: string | null;
  token_type: TokenType;
  exchange_rate: string | null;
  total_supply: string | null;
  is_verified_via_admin_panel: boolean;
  is_smart_contract_verified: boolean;
}

export interface SearchResultAddressOrContract {
  type: 'address' | 'contract';
  name: string | null;
  address: string;
  is_smart_contract_verified: boolean;
  url?: string; // not used by the frontend, we build the url ourselves
}

export interface SearchResultLabel {
  type: 'label';
  address: string;
  name: string;
  is_smart_contract_verified: boolean;
  url?: string; // not used by the frontend, we build the url ourselves
}

export interface SearchResultBlock {
  type: 'block';
  block_type?: 'block' | 'reorg';
  block_number: number | string;
  block_hash: string;
  timestamp: string;
  url?: string; // not used by the frontend, we build the url ourselves
}

export interface SearchResultTx {
  type: 'transaction';
  tx_hash: string;
  timestamp: string;
  url?: string; // not used by the frontend, we build the url ourselves
}

export type SearchResultItem = SearchResultToken | SearchResultAddressOrContract | SearchResultBlock | SearchResultTx | SearchResultLabel;

export interface SearchResult {
  items: Array<SearchResultItem>;
  next_page_params: {
    'address_hash': string | null;
    'block_hash': string | null;
    'holder_count': number | null;
    'inserted_at': string | null;
    'item_type': SearchResultType;
    'items_count': number;
    'name': string;
    'q': string;
    'tx_hash': string | null;
  } | null;
}

export interface SearchResultFilters {
  q: string;
}

export interface SearchRedirectResult {
  parameter: string | null;
  redirect: boolean;
  type: 'address' | 'block' | 'transaction' | null;
}
