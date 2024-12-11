import type { AddressParam } from './addressParams';
import type { TokenInfo } from './token';

export type AdvancedFilterParams = {
  tx_types?: Array<AdvancedFilterType>;
  methods?: Array<string>;
  methods_names?: Array<string>; /* frontend only */
  age_from?: string;
  age_to?: string;
  age?: AdvancedFilterAge | ''; /* frontend only */
  from_address_hashes_to_include?: Array<string>;
  from_address_hashes_to_exclude?: Array<string>;
  to_address_hashes_to_include?: Array<string>;
  to_address_hashes_to_exclude?: Array<string>;
  address_relation?: 'or' | 'and';
  amount_from?: string;
  amount_to?: string;
  token_contract_address_hashes_to_include?: Array<string>;
  token_contract_address_hashes_to_exclude?: Array<string>;
  token_contract_symbols_to_include?: Array<string>;
  token_contract_symbols_to_exclude?: Array<string>;
};

export const ADVANCED_FILTER_TYPES = [ 'coin_transfer', 'ERC-20', 'ERC-404', 'ERC-721', 'ERC-1155' ] as const;
export type AdvancedFilterType = typeof ADVANCED_FILTER_TYPES[number];

export const ADVANCED_FILTER_AGES = [ '1h', '24h', '7d', '1m', '3m', '6m' ] as const;
export type AdvancedFilterAge = typeof ADVANCED_FILTER_AGES[number];

export type AdvancedFilterResponseItem = {
  fee: string;
  from: AddressParam;
  created_contract?: AddressParam;
  hash: string;
  method: string | null;
  timestamp: string;
  to: AddressParam;
  token: TokenInfo | null;
  total: {
    decimals: string | null;
    value: string;
  } | null;
  type: string;
  value: string | null;
};

export type AdvancedFiltersSearchParams = {
  methods: Record<string, string>;
  tokens: Record<string, TokenInfo>;
};

export type AdvancedFilterResponse = {
  items: Array<AdvancedFilterResponseItem>;
  search_params: AdvancedFiltersSearchParams;
  next_page_params: {
    block_number: number;
    internal_transaction_index: number | null;
    token_transfer_index: number | null;
    transaction_index: number;
    items_count: number;
  };
};

export type AdvancedFilterMethodsResponse = Array<AdvancedFilterMethodInfo>;

export type AdvancedFilterMethodInfo = {
  method_id: string;
  name?: string;
};
