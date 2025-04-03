import { Flex } from '@chakra-ui/react';
import { isEqual, without } from 'es-toolkit';
import React from 'react';

import type { AdvancedFilterParams, AdvancedFilterType } from 'types/api/advancedFilter';

import { Checkbox, CheckboxGroup } from 'toolkit/chakra/checkbox';
import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';

import { ADVANCED_FILTER_TYPES_WITH_ALL } from '../constants';

const RESET_VALUE = 'all';

const FILTER_PARAM = 'transaction_types';

type Props = {
  value?: Array<AdvancedFilterType | typeof RESET_VALUE>;
  handleFilterChange: (filed: keyof AdvancedFilterParams, value: Array<AdvancedFilterType>) => void;
};

const TypeFilter = ({ value = [ RESET_VALUE ], handleFilterChange }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<Array<AdvancedFilterType | typeof RESET_VALUE>>([ ...value ]);

  const handleChange = React.useCallback((value: Array<string>) => {
    setCurrentValue((prev) => {
      if (value.length === 0) {
        return [ RESET_VALUE ];
      }

      const diff = value.filter(item => !prev.includes(item));
      if (diff.includes(RESET_VALUE)) {
        return [ RESET_VALUE ];
      }

      return without(value as Array<AdvancedFilterType>, RESET_VALUE);
    });
  }, []);

  const onReset = React.useCallback(() => setCurrentValue([ RESET_VALUE ]), []);

  const onFilter = React.useCallback(() => {
    const value: Array<AdvancedFilterType> = currentValue.filter(item => item !== RESET_VALUE) as Array<AdvancedFilterType>;
    handleFilterChange(FILTER_PARAM, value);
  }, [ handleFilterChange, currentValue ]);

  return (
    <TableColumnFilter
      title="Type of transfer"
      isFilled={ !(currentValue.length === 1 && currentValue[0] === RESET_VALUE) }
      isTouched={ !isEqual(currentValue.sort(), value.sort()) }
      onFilter={ onFilter }
      onReset={ onReset }
      hasReset
    >
      <Flex display="flex" flexDir="column" rowGap={ 3 }>
        <CheckboxGroup value={ currentValue } onValueChange={ handleChange } orientation="vertical">
          { ADVANCED_FILTER_TYPES_WITH_ALL.map(type => (
            <Checkbox
              key={ type.id }
              value={ type.id }
            >
              { type.name }
            </Checkbox>
          )) }
        </CheckboxGroup>
      </Flex>
    </TableColumnFilter>
  );
};

export default TypeFilter;
