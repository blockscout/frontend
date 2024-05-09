import React from 'react';

import type { AdvancedFilterParams, AdvancedFiltersSearchParams } from 'types/api/advancedFilter';

import type { ColumnsIds } from 'ui/pages/AdvancedFilter';

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
}
const FilterByColumn = ({ column, filters, searchParams, columnName, handleFilterChange }: Props) => {
  const commonProps = { columnName, handleFilterChange };
  switch (column) {
    case 'type': {
      return <TypeFilter { ...commonProps } value={ filters.tx_types }/>;
    }
    case 'method':
      // fix value
      return <MethodFilter { ...commonProps } value={ searchParams?.methods }/>;
    case 'age':
      return <AgeFilter { ...commonProps } value={{ age: filters.age, from: filters.age_from, to: filters.age_to }}/>;
    // case 'from':
    //   return <AddressEntity address={ item.from } truncation="constant"/>;
    // case 'to':
    //   return <AddressEntity address={ item.to } truncation="constant"/>;
    case 'amount':
      // fix types
      return <AmountFilter { ...commonProps } value={{ from: filters.amount_from, to: filters.amount_to }}/>;
    case 'asset': {
      const tokens = searchParams?.tokens;

      const value = tokens ?
        Object.entries(tokens).map(([ address, token ]) =>
          ({ token, mode: filters.token_contract_address_hashes_to_include?.includes(address) ? 'include' as AssetFilterMode : 'exclude' as AssetFilterMode }),
        ) : [];
      return <AssetFilter { ...commonProps } value={ value }/>;
    }
    default:
      return null;
  }
};

export default FilterByColumn;
