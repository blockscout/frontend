import React from 'react';

import type { AdvancedFilterParams, AdvancedFiltersSearchParams } from 'types/api/advancedFilter';

import type { ColumnsIds } from 'ui/pages/AdvancedFilter';

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
  searchParams?: AdvancedFiltersSearchParams;
  column: ColumnsIds;
  columnName: string;
  handleFilterChange: (field: keyof AdvancedFilterParams, val: unknown) => void;
  isLoading?: boolean;
}
const FilterByColumn = ({ column, filters, columnName, handleFilterChange, searchParams, isLoading }: Props) => {
  const commonProps = { columnName, handleFilterChange, isLoading };
  switch (column) {
    case 'type':
      return <TypeFilter { ...commonProps } value={ filters.tx_types }/>;
    case 'method': {
      const value = filters.methods?.map(m => searchParams?.methods[m] || { method_id: m });
      return <MethodFilter { ...commonProps } value={ value }/>;
    }
    case 'age':
      return <AgeFilter { ...commonProps } value={{ age: filters.age, from: filters.age_from, to: filters.age_to }}/>;
    case 'or_and':
      return <AddressRelationFilter { ...commonProps } value={ filters.address_relation }/>;
    case 'from': {
      const valueInclude = filters?.from_address_hashes_to_include?.map(hash => ({ address: hash, mode: 'include' as AddressFilterMode }));
      const valueExclude = filters?.from_address_hashes_to_exclude?.map(hash => ({ address: hash, mode: 'exclude' as AddressFilterMode }));

      const value = (valueInclude || []).concat(valueExclude || []);

      return <AddressFilter { ...commonProps } type="from" value={ value }/>;

    }
    case 'to': {
      const valueInclude = filters?.to_address_hashes_to_include?.map(hash => ({ address: hash, mode: 'include' as AddressFilterMode }));
      const valueExclude = filters?.to_address_hashes_to_exclude?.map(hash => ({ address: hash, mode: 'exclude' as AddressFilterMode }));

      const value = (valueInclude || []).concat(valueExclude || []);

      return <AddressFilter { ...commonProps } type="to" value={ value }/>;
    }
    case 'amount':
      return <AmountFilter { ...commonProps } value={{ from: filters.amount_from, to: filters.amount_to }}/>;
    case 'asset': {
      const tokens = searchParams?.tokens;

      const value = tokens ?
        Object.entries(tokens).map(([ address, token ]) => {
          const mode = filters.token_contract_address_hashes_to_include?.find(i => i.toLowerCase() === address) ?
            'include' as AssetFilterMode :
            'exclude' as AssetFilterMode;
          return ({ token, mode });
        }) : [];

      return <AssetFilter { ...commonProps } value={ value }/>;
    }
    default:
      return null;
  }
};

export default FilterByColumn;
