// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressParam } from 'client/slices/address/types/api';

export interface HotContract {
  contract_address: AddressParam;
  balance: string;
  transactions_count: string;
  total_gas_used: string;
}

export interface HotContractsResponse {
  items: Array<HotContract>;
  next_page_params: {
    items_count: string;
    transactions_count: string;
    total_gas_used: string;
    contract_address_hash: string;
  } | null;
}

export interface HotContractsFilters {
  scale?: HotContractsInterval;
}

export interface HotContractsSorting {
  sort: 'transactions_count' | 'total_gas_used';
  order: 'asc' | 'desc';
}

export type HotContractsSortingField = HotContractsSorting['sort'];

export type HotContractsSortingValue = `${ HotContractsSortingField }-${ HotContractsSorting['order'] }` | 'default';

export type HotContractsInterval = '5m' | '1h' | '3h' | '1d' | '7d' | '30d';
