import { Flex, Checkbox, CheckboxGroup } from '@chakra-ui/react';
import without from 'lodash/without';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { AdvancedFilterParams, AdvancedFilterType } from 'types/api/advancedFilter';

import ColumnFilter from '../ColumnFilter';
import { ADVANCED_FILTER_TYPES_WITH_ALL } from '../constants';

const RESET_VALUE = 'all';

const FILTER_PARAM = 'tx_types';

type Props = {
  value?: Array<AdvancedFilterType>;
  handleFilterChange: (filed: keyof AdvancedFilterParams, value: Array<AdvancedFilterType>) => void;
  columnName: string;
  isLoading?: boolean;
}

const TypeFilter = ({ value = [], handleFilterChange, columnName, isLoading }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<Array<AdvancedFilterType>>(value);

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const id = event.target.id as AdvancedFilterType | 'all';
    if (id === RESET_VALUE) {
      setCurrentValue([]);
    } else {
      setCurrentValue(prev => checked ? [ ...prev, id ] : without(prev, id));
    }
  }, []);

  const onReset = React.useCallback(() => setCurrentValue([]), []);

  const onFilter = React.useCallback(() => {
    handleFilterChange(FILTER_PARAM, currentValue);
  }, [ handleFilterChange, currentValue ]);

  return (
    <ColumnFilter
      columnName={ columnName }
      title="Type of transfer"
      isActive={ Boolean(value.length) }
      isFilled={ true }
      onFilter={ onFilter }
      onReset={ onReset }
      isLoading={ isLoading }
    >
      <Flex display="flex" flexDir="column" rowGap={ 3 }>
        <CheckboxGroup value={ currentValue.length ? currentValue : [ 'all' ] }>
          { ADVANCED_FILTER_TYPES_WITH_ALL.map(type => (
            <Checkbox
              key={ type.id }
              value={ type.id }
              id={ type.id }
              onChange={ handleChange }
            >
              { type.name }
            </Checkbox>
          )) }
        </CheckboxGroup>
      </Flex>
    </ColumnFilter>
  );
};

export default TypeFilter;
