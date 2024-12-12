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
  filecoin_robust_address?: string | null;
  certified?: boolean;
}

export interface SearchResultAddressOrContract {
  type: 'address' | 'contract';
  name: string | null;
  address: string;
  is_smart_contract_verified: boolean;
  certified?: true;
  filecoin_robust_address?: string | null;
  url?: string; // not used by the frontend, we build the url ourselves
  ens_info?: {
    address_hash: string;
    expiry_date?: string;
    name: string;
    names_count: number;
  };
}

export interface SearchResultDomain {
  type: 'ens_domain';
  name: string | null;
  address: string;
  filecoin_robust_address?: string | null;
  is_smart_contract_verified: boolean;
  url?: string; // not used by the frontend, we build the url ourselves
  ens_info: {
    address_hash: string;
    expiry_date?: string;
    name: string;
    names_count: number;
  };
}

export interface SearchResultLabel {
  type: 'label';
  address: string;
  filecoin_robust_address?: string | null;
  name: string;
  is_smart_contract_verified: boolean;
  url?: string; // not used by the frontend, we build the url ourselves
}

export interface SearchResultBlock {
  type: 'block';
  block_type?: 'block' | 'reorg' | 'uncle';
  block_number: number | string;
  block_hash: string;
  timestamp: string;
  url?: string; // not used by the frontend, we build the url ourselves
}

export interface SearchResultTx {
  type: 'transaction';
  transaction_hash: string;
  timestamp: string;
  url?: string; // not used by the frontend, we build the url ourselves
}

export interface SearchResultBlob {
  type: 'blob';
  blob_hash: string;
  timestamp: null;
}

export interface SearchResultUserOp {
  type: 'user_operation';
  user_operation_hash: string;
  timestamp: string;
  url?: string; // not used by the frontend, we build the url ourselves
}

export type SearchResultItem = SearchResultToken | SearchResultAddressOrContract | SearchResultBlock | SearchResultTx | SearchResultLabel | SearchResultUserOp |
SearchResultBlob | SearchResultDomain;

export interface SearchResult {
  items: Array<SearchResultItem>;
  next_page_params: {
    address_hash: string | null;
    block_hash: string | null;
    holder_count: number | null;
    inserted_at: string | null;
    item_type: SearchResultType;
    items_count: number;
    name: string;
    q: string;
    transaction_hash: string | null;
  } | null;
}

export interface SearchResultFilters {
  q: string;
}

export interface SearchRedirectResult {
  parameter: string | null;
  redirect: boolean;
  type: 'address' | 'block' | 'transaction' | 'user_operation' | 'blob' | null;
}
