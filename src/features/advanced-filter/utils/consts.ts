// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AdvancedFilterParams } from '../types/api';
import type { ColumnsIds, TxTableColumn } from '../types/client';
import type { ColumnStates } from 'src/shared/lists/columns/types';
import type { ChainConfig } from 'src/slices/token/types/client';

import { toTokenModel } from 'src/slices/token/utils/model';
import { isTokenMultiplierEnabled } from 'src/slices/token/utils/ui-multiplier';

import config from 'src/config';

export const TABLE_COLUMNS: Array<TxTableColumn> = [
  {
    id: 'tx_hash',
    name: 'Tx hash',
  },
  {
    id: 'type',
    name: 'Type',
  },
  {
    id: 'method',
    name: 'Method',
    maxWidth: '160px',
  },
  {
    id: 'age',
    name: 'Age',
  },
  {
    id: 'from',
    name: 'From',
    maxWidth: '200px',
  },
  {
    id: 'or_and',
    name: '',
    maxWidth: '65px',
  },
  {
    id: 'to',
    name: 'To',
    maxWidth: '200px',
  },
  {
    id: 'multiplier',
    name: 'Multiplier',
    isNumeric: true,
    noFilter: true,
  },
  {
    id: 'amount',
    name: 'Amount',
    isNumeric: true,
  },
  {
    id: 'asset',
    name: 'Asset',
    maxWidth: '240px',
  },
  {
    id: 'fee',
    name: 'Fee',
    isNumeric: true,
  },
] as const;

export function getColumnStates(chainConfig?: ChainConfig): ColumnStates<ColumnsIds> {
  return {
    tx_hash: 'on',
    type: 'on',
    method: 'on',
    age: 'on',
    from: 'on',
    or_and: 'on',
    to: 'on',
    multiplier: isTokenMultiplierEnabled(chainConfig) ? 'on' : 'unavailable',
    amount: 'on',
    asset: 'on',
    fee: 'on',
  };
}

export const NATIVE_TOKEN = toTokenModel({
  name: config.chain.currency.name || '',
  icon_url: '',
  symbol: config.chain.currency.symbol || '',
  address_hash: 'native',
  type: 'ERC-20',
});

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
