import { CheckboxGroup, Checkbox, Text } from '@chakra-ui/react';
import React from 'react';

import type { TxInternalsType } from 'types/api/internalTransaction';

import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

interface Props {
  appliedFiltersNum?: number;
  defaultFilters: Array<TxInternalsType>;
  onFilterChange: (nextValue: Array<TxInternalsType>) => void;
}

const TxInternalsFilter = ({ onFilterChange, defaultFilters, appliedFiltersNum }: Props) => {
  return (
    <PopoverFilter appliedFiltersNum={ appliedFiltersNum } contentProps={{ w: { md: '100%', lg: '438px' } }}>
      <CheckboxGroup size="lg" onChange={ onFilterChange } defaultValue={ defaultFilters }>
        { TX_INTERNALS_ITEMS.map(({ title, id }) => <Checkbox key={ id } value={ id }><Text fontSize="md">{ title }</Text></Checkbox>) }
      </CheckboxGroup>
    </PopoverFilter>
  );
};

export default React.memo(TxInternalsFilter);
