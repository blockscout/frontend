// SPDX-License-Identifier: LicenseRef-Blockscout

import { isEqual, without } from 'es-toolkit';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';
import ColumnFilterContent from 'src/shared/filters/ColumnFilterContent';

import { Checkbox, CheckboxGroup } from 'src/toolkit/chakra/checkbox';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

import type { CrossChainColumnFilterField } from './utils';
import { getProtocolOptions, joinFilterValue, splitFilterValue } from './utils';

const RESET_VALUE = 'all';

const FILTER_FIELD: CrossChainColumnFilterField = 'bridge_ids';

const CONFIGURED_BRIDGE_IDS: Array<number> = getFeaturePayload(config.features.crossChainTxs)?.bridgeIds ?? [];

interface Props {
  value: string | undefined;
  handleFilterChange: (field: CrossChainColumnFilterField, value: string | undefined) => void;
}

function toCheckboxValue(value: string | undefined): Array<string> {
  const ids = splitFilterValue(value);
  return ids.length > 0 ? ids : [ RESET_VALUE ];
}

const ProtocolFilter = ({ value, handleFilterChange }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<Array<string>>(() => toCheckboxValue(value));

  const bridgesQuery = useApiQuery('interchainIndexer:bridges', { queryOptions: { refetchOnMount: false } });

  const options = React.useMemo(
    () => getProtocolOptions(bridgesQuery.data?.items, CONFIGURED_BRIDGE_IDS),
    [ bridgesQuery.data?.items ],
  );

  const handleChange = React.useCallback((value: Array<string>) => {
    setCurrentValue((prev) => {
      if (value.length === 0) {
        return [ RESET_VALUE ];
      }

      const added = value.filter((item) => !prev.includes(item));
      if (added.includes(RESET_VALUE)) {
        return [ RESET_VALUE ];
      }

      return without(value, RESET_VALUE);
    });
  }, []);

  const handleReset = React.useCallback(() => setCurrentValue([ RESET_VALUE ]), []);

  const handleFilter = React.useCallback(() => {
    handleFilterChange(FILTER_FIELD, joinFilterValue(without(currentValue, RESET_VALUE)));
  }, [ handleFilterChange, currentValue ]);

  return (
    <ColumnFilterContent
      title="Protocol"
      isFilled={ !isEqual(currentValue, [ RESET_VALUE ]) }
      isTouched={ !isEqual(currentValue.slice().sort(), toCheckboxValue(value).slice().sort()) }
      onFilter={ handleFilter }
      onReset={ handleReset }
      hasReset
    >
      <CheckboxGroup value={ currentValue } onValueChange={ handleChange } orientation="vertical">
        <Checkbox value={ RESET_VALUE }>All</Checkbox>
        { bridgesQuery.isPending && <Skeleton loading h={ 5 } w="120px"/> }
        { options.map((option) => (
          <Checkbox key={ option.id } value={ option.id }>
            { option.name }
          </Checkbox>
        )) }
      </CheckboxGroup>
    </ColumnFilterContent>
  );
};

export default React.memo(ProtocolFilter);
