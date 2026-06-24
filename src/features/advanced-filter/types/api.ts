// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TokenType } from 'src/slices/token/types/api';

export const ADVANCED_FILTER_ADDRESS_RELATION = [ 'or', 'and' ] as const;
export type AddressRelation = typeof ADVANCED_FILTER_ADDRESS_RELATION[number];

export type AdvancedFilterParams = {
  transaction_types?: Array<AdvancedFilterType>;
  methods?: Array<string>;
  methods_names?: Array<string>; /* frontend only */
  age_from?: string;
  age_to?: string;
  age?: AdvancedFilterAge | ''; /* frontend only */
  from_address_hashes_to_include?: Array<string>;
  from_address_hashes_to_exclude?: Array<string>;
  to_address_hashes_to_include?: Array<string>;
  to_address_hashes_to_exclude?: Array<string>;
  address_relation?: AddressRelation;
  amount_from?: string;
  amount_to?: string;
  token_contract_address_hashes_to_include?: Array<string>;
  token_contract_address_hashes_to_exclude?: Array<string>;
  token_contract_symbols_to_include?: Array<string>;
  token_contract_symbols_to_exclude?: Array<string>;
};

export type AdvancedFilterType = 'coin_transfer' | 'contract_creation' | 'contract_interaction' | TokenType;

export const ADVANCED_FILTER_AGES = [ '1h', '24h', '7d', '1m', '3m', '6m' ] as const;
export type AdvancedFilterAge = typeof ADVANCED_FILTER_AGES[number];
