// SPDX-License-Identifier: LicenseRef-Blockscout

import { isEqual } from 'es-toolkit';
import React from 'react';

import type { AdvancedFilterParams, AdvancedFilterType } from '../../types/api';

import { useMultichainContext } from 'src/features/multichain/context';

import ColumnFilterContent from 'src/shared/filters/ColumnFilterContent';
import ColumnFilterContentSection from 'src/shared/filters/ColumnFilterContentSection';

import { Checkbox, CheckboxGroup } from 'src/toolkit/chakra/checkbox';

import { getAdvancedFilterTypes } from '../../utils/lib';

const FILTER_PARAM = 'transaction_types';

const NO_TYPES: Array<AdvancedFilterType> = [];

type Props = {
  value?: Array<AdvancedFilterType>;
  handleFilterChange: (filed: keyof AdvancedFilterParams, value: Array<AdvancedFilterType>) => void;
};

const TypeFilter = ({ value = NO_TYPES, handleFilterChange }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<Array<AdvancedFilterType>>([ ...value ]);

  const multichainContext = useMultichainContext();

  const handleChange = React.useCallback((value: Array<string>) => {
    setCurrentValue(value as Array<AdvancedFilterType>);
  }, []);

  const onReset = React.useCallback(() => setCurrentValue([]), []);

  const onFilter = React.useCallback(() => {
    handleFilterChange(FILTER_PARAM, currentValue);
  }, [ handleFilterChange, currentValue ]);

  const advancedFilterTypes = React.useMemo(() => {
    return getAdvancedFilterTypes(multichainContext?.chain?.app_config);
  }, [ multichainContext?.chain?.app_config ]);

  return (
    <ColumnFilterContent
      isTouched={ !isEqual(currentValue.slice().sort(), value.slice().sort()) }
      onFilter={ onFilter }
    >
      <ColumnFilterContentSection title="Transaction type" onReset={ onReset } isFilled={ currentValue.length > 0 }>
        <CheckboxGroup value={ currentValue } onValueChange={ handleChange } orientation="vertical">
          { advancedFilterTypes.map(type => (
            <Checkbox
              key={ type.id }
              value={ type.id }
            >
              { type.name }
            </Checkbox>
          )) }
        </CheckboxGroup>
      </ColumnFilterContentSection>
    </ColumnFilterContent>
  );
};

export default TypeFilter;
