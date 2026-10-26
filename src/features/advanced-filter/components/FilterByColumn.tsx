// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AdvancedFilterParams } from '../types/api';
import type { ColumnsIds } from '../types/client';
import type { schemas } from '@blockscout/api-types';

import ColumnFilter from 'src/shared/filters/ColumnFilter';

import { NATIVE_TOKEN } from '../utils/consts';
import type { AddressFilterMode } from './filters/AddressFilter';
import AddressFilter from './filters/AddressFilter';
import AddressRelationFilter from './filters/AddressRelationFilter';
import AgeFilter from './filters/AgeFilter';
import AmountFilter from './filters/AmountFilter';
import type { AssetFilterMode } from './filters/AssetFilter';
import AssetFilter from './filters/AssetFilter';
import MethodFilter from './filters/MethodFilter';
import TypeFilter from './filters/TypeFilter';

type Props = {
  filters: AdvancedFilterParams;
  searchParams?: schemas['AdvancedFilterSearchParams'];
  column: ColumnsIds;
  columnName: string;
  handleFilterChange: <T extends keyof AdvancedFilterParams>(field: T, val: AdvancedFilterParams[T]) => void;
  isLoading?: boolean;
};

const FilterByColumn = ({ column, filters, columnName, handleFilterChange, searchParams, isLoading }: Props) => {
  const commonProps = { columnName, handleFilterChange, isLoading };
  switch (column) {
    case 'type': {
      const value = filters.transaction_types;
      return (
        <ColumnFilter
          columnName="Type"
          isLoading={ isLoading }
          selected={ Boolean(value && value.length) }
        >
          <TypeFilter { ...commonProps } value={ value }/>
        </ColumnFilter>
      );
    }
    case 'method': {
      const value = filters.methods?.map(m => ({ name: searchParams?.methods[m] || m, method_id: m }));
      return (
        <ColumnFilter
          columnName="Method"
          isLoading={ isLoading }
          selected={ Boolean(value && value.length) }
        >
          <MethodFilter { ...commonProps } value={ value }/>
        </ColumnFilter>
      );
    }
    case 'age': {
      const value = { age: filters.age || '' as const, from: filters.age_from || '', to: filters.age_to || '' };
      return (
        <ColumnFilter
          columnName="Age"
          isLoading={ isLoading }
          selected={ Boolean(value.from || value.to || value.age) }
        >
          <AgeFilter { ...commonProps } value={ value }/>
        </ColumnFilter>
      );
    }
    case 'or_and': {
      return (
        <ColumnFilter
          columnName="And/Or"
          isLoading={ isLoading }
          selected
          contentProps={{ w: '106px' }}
          value={ filters.address_relation === 'and' ? 'AND' : 'OR' }
        >
          <AddressRelationFilter { ...commonProps } value={ filters.address_relation }/>
        </ColumnFilter>
      );
    }
    case 'from': {
      const valueInclude = filters?.from_address_hashes_to_include?.map(hash => ({ address: hash, mode: 'include' as AddressFilterMode }));
      const valueExclude = filters?.from_address_hashes_to_exclude?.map(hash => ({ address: hash, mode: 'exclude' as AddressFilterMode }));

      const value = (valueInclude || []).concat(valueExclude || []);
      return (
        <ColumnFilter
          columnName="Address from"
          isLoading={ isLoading }
          selected={ Boolean(value.length) }
          contentProps={{ w: '480px' }}
        >
          <AddressFilter { ...commonProps } type="from" value={ value }/>
        </ColumnFilter>
      );

    }
    case 'to': {
      const valueInclude = filters?.to_address_hashes_to_include?.map(hash => ({ address: hash, mode: 'include' as AddressFilterMode }));
      const valueExclude = filters?.to_address_hashes_to_exclude?.map(hash => ({ address: hash, mode: 'exclude' as AddressFilterMode }));

      const value = (valueInclude || []).concat(valueExclude || []);
      return (
        <ColumnFilter
          columnName="Address to"
          isLoading={ isLoading }
          selected={ Boolean(value.length) }
          contentProps={{ w: '480px' }}
        >
          <AddressFilter { ...commonProps } type="to" value={ value }/>
        </ColumnFilter>
      );
    }
    case 'amount': {
      const value = { from: filters.amount_from, to: filters.amount_to };
      return (
        <ColumnFilter
          columnName="Amount"
          isLoading={ isLoading }
          selected={ Boolean(value.from || value.to) }
        >
          <AmountFilter { ...commonProps } value={ value }/>
        </ColumnFilter>
      );
    }
    case 'asset': {
      const tokens = searchParams?.tokens;

      const value = tokens ?
        Object.entries(tokens).map(([ address, token ]) => {
          const mode = filters.token_contract_address_hashes_to_include?.find(i => i.toLowerCase() === address.toLowerCase()) ?
            'include' as AssetFilterMode :
            'exclude' as AssetFilterMode;
          return ({ token, mode });
        }) : [];
      if (filters.token_contract_address_hashes_to_include?.includes('native')) {
        value.unshift({ token: NATIVE_TOKEN, mode: 'include' });
      }
      if (filters.token_contract_address_hashes_to_exclude?.includes('native')) {
        value.unshift({ token: NATIVE_TOKEN, mode: 'exclude' });
      }
      return (
        <ColumnFilter
          columnName="Asset"
          isLoading={ isLoading }
          selected={ Boolean(value.length) }
        >
          <AssetFilter { ...commonProps } value={ value }/>
        </ColumnFilter>
      );
    }
    default: {
      return null;
    }
  }
};

export default FilterByColumn;
