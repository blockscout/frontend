import type { AddressParam } from './addressParams';
import type { SmartContractLicenseType } from './contract';

export type VerifiedContractsLanguage = 'solidity' | 'vyper' | 'yul' | 'scilla' | 'stylus_rust' | 'geas';

export interface VerifiedContract {
  address: AddressParam;
  certified?: boolean;
  coin_balance: string;
  compiler_version: string | null;
  language: VerifiedContractsLanguage;
  has_constructor_args: boolean;
  optimization_enabled: boolean;
  transactions_count: number | null;
  verified_at: string;
  market_cap: string | null;
  license_type: SmartContractLicenseType | null;
  zk_compiler_version?: string;
}

export interface VerifiedContractsResponse {
  items: Array<VerifiedContract>;
  next_page_params: {
    items_count: string;
    smart_contract_id: string;
  } | null;
}

export type VerifiedContractsFilter = Exclude<VerifiedContractsLanguage, 'stylus_rust'>;

export interface VerifiedContractsFilters {
  q: string | undefined;
  filter: VerifiedContractsFilter | undefined;
}

export type VerifiedContractsCounters = {
  new_smart_contracts_24h: string;
  new_verified_smart_contracts_24h: string;
  smart_contracts: string;
  verified_smart_contracts: string;
};
