// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';

import type { AdvancedFilterParams } from '../types/api';
import type { TxTableColumn } from '../types/client';
import type { TokenInfo } from 'client/slices/token/types/api';

export const TABLE_COLUMNS: Array<TxTableColumn> = [
  {
    id: 'tx_hash',
    name: 'Tx hash',
    width: '180px',
  },
  {
    id: 'type',
    name: 'Type',
    width: '160px',
  },
  {
    id: 'method',
    name: 'Method',
    width: '160px',
  },
  {
    id: 'age',
    name: 'Age',
    width: '190px',
  },
  {
    id: 'from',
    name: 'From',
    width: '160px',
  },
  {
    id: 'or_and',
    name: '',
    width: '65px',
  },
  {
    id: 'to',
    name: 'To',
    width: '160px',
  },
  {
    id: 'amount',
    name: 'Amount',
    isNumeric: true,
    width: '150px',
  },
  {
    id: 'asset',
    name: 'Asset',
    width: '120px',
  },
  {
    id: 'fee',
    name: 'Fee',
    isNumeric: true,
    width: '120px',
  },
] as const;

export const NATIVE_TOKEN = {
  name: config.chain.currency.name || '',
  icon_url: '',
  symbol: config.chain.currency.symbol || '',
  address_hash: 'native',
  type: 'ERC-20' as const,
} as TokenInfo;

export const FILTER_PARAM_NAMES: Record<keyof AdvancedFilterParams, string> = {
  // we don't show address_relation as filter tag
  address_relation: '',
  age: 'Age',
  age_from: 'Date from',
  age_to: 'Date to',
  amount_from: 'Amount from',
  amount_to: 'Amount to',
  from_address_hashes_to_exclude: 'From Exc',
  from_address_hashes_to_include: 'From',
  methods: 'Methods',
  methods_names: '',
  to_address_hashes_to_exclude: 'To Exc',
  to_address_hashes_to_include: 'To',
  token_contract_address_hashes_to_exclude: 'Asset Exc',
  token_contract_symbols_to_exclude: '',
  token_contract_address_hashes_to_include: 'Asset',
  token_contract_symbols_to_include: '',
  transaction_types: 'Type',
};
