import type { AddressParam } from './addressParams';

export interface VerifiedContract {
  address: AddressParam;
  coin_balance: string;
  compiler_version: string;
  language: 'vyper' | 'yul' | 'solidity';
  has_constructor_args: boolean;
  optimization_enabled: boolean;
  tx_count: number;
  verified_at: string;
  market_cap: string | null;
}

export interface VerifiedContractsResponse {
  items: Array<VerifiedContract>;
  next_page_params: {
    items_count: string;
    smart_contract_id: string;
  } | null;
}

export interface VerifiedContractsFilters {
  q: string | undefined;
  filter: 'vyper' | 'solidity' | undefined;
}
