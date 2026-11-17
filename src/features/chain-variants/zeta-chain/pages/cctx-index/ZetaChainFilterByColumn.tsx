// SPDX-License-Identifier: LicenseRef-Blockscout

import { castArray } from 'es-toolkit/compat';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { AdvancedFilterAge } from 'src/features/advanced-filter/types/api';
import { ZETA_CHAIN_CCTX_COIN_TYPE_FILTER, type ZetaChainCCTXFilterParams } from 'src/features/chain-variants/zeta-chain/types/client';

import { toTokenModel } from 'src/slices/token/utils/model';

import ColumnFilter from 'src/shared/filters/ColumnFilter';

import ZetaChainAgeFilter from './ZetaChainAgeFilter';
import ZetaChainAssetFilter, { ZETA_NATIVE_TOKEN } from './ZetaChainAssetFilter';
import ZetaChainReceiverFilter from './ZetaChainReceiverFilter';
import ZetaChainSenderFilter from './ZetaChainSenderFilter';
import ZetaChainStatusFilter from './ZetaChainStatusFilter';

type ColumnId = 'age' | 'status' | 'sender' | 'receiver' | 'asset';

type Props = {
  filters: ZetaChainCCTXFilterParams;
  column: ColumnId;
  columnName: string;
  handleFilterChange: <T extends keyof ZetaChainCCTXFilterParams>(field: T, val: ZetaChainCCTXFilterParams[T]) => void;
  isLoading?: boolean;
};

function getAssetFilterValue(filters: ZetaChainCCTXFilterParams): schemas['Token'] | null {
  if (filters.token_symbol?.[0]) {
    return toTokenModel({
      address_hash: '',
      symbol: filters.token_symbol[0],
      name: filters.token_symbol[0],
      decimals: '18',
      total_supply: '0',
      icon_url: null,
      type: 'ERC-20',
      holders_count: null,
      exchange_rate: null,
      circulating_market_cap: null,
      reputation: null,
    });
  }
  if (filters.coin_type && castArray(filters.coin_type).includes(ZETA_CHAIN_CCTX_COIN_TYPE_FILTER)) {
    return ZETA_NATIVE_TOKEN;
  }
  return null;
}

const ZetaChainFilterByColumn = ({ column, filters, columnName, handleFilterChange, isLoading }: Props) => {
  const commonProps = { columnName, handleFilterChange, isLoading };

  switch (column) {
    case 'age': {
      const value = { age: (filters.age || '') as AdvancedFilterAge | '', from: filters.start_timestamp || '', to: filters.end_timestamp || '' };
      return (
        <ColumnFilter
          columnName="Age"
          isLoading={ isLoading }
          selected={ Boolean(value.age || value.from || value.to) }
          contentProps={{ w: '382px' }}
        >
          <ZetaChainAgeFilter { ...commonProps } value={ value }/>
        </ColumnFilter>
      );
    }
    case 'status': {
      const value = filters.status_reduced ? castArray(filters.status_reduced) : [];
      return (
        <ColumnFilter
          columnName="Status"
          isLoading={ isLoading }
          selected={ Boolean(value && value.length) }
          contentProps={{ w: '200px' }}
        >
          <ZetaChainStatusFilter { ...commonProps } value={ value }/>
        </ColumnFilter>
      );
    }
    case 'sender': {
      const value = filters.sender_address ? castArray(filters.sender_address) : [];
      const chainValue = filters.source_chain_id ? castArray(filters.source_chain_id) : [];
      return (
        <ColumnFilter
          columnName="Sender"
          isLoading={ isLoading }
          selected={ Boolean(value && value.length) || Boolean(chainValue && chainValue.length) }
          contentProps={{ w: '480px' }}
        >
          <ZetaChainSenderFilter { ...commonProps } value={ value } chainValue={ chainValue }/>
        </ColumnFilter>
      );
    }
    case 'receiver': {
      const value = filters.receiver_address ? castArray(filters.receiver_address) : [];
      const chainValue = filters.target_chain_id ? castArray(filters.target_chain_id) : [];
      return (
        <ColumnFilter
          columnName="Receiver"
          isLoading={ isLoading }
          selected={ Boolean(value && value.length) || Boolean(chainValue && chainValue.length) }
          contentProps={{ w: '480px' }}
        >
          <ZetaChainReceiverFilter { ...commonProps } value={ value } chainValue={ chainValue }/>
        </ColumnFilter>
      );
    }
    case 'asset': {
      const value = getAssetFilterValue(filters);
      return (
        <ColumnFilter
          columnName="Asset"
          isLoading={ isLoading }
          selected={ Boolean(value) }
          contentProps={{ w: '350px' }}
        >
          <ZetaChainAssetFilter { ...commonProps } value={ value }/>
        </ColumnFilter>
      );
    }
    default:
      return null;
  }
};

export default ZetaChainFilterByColumn;
