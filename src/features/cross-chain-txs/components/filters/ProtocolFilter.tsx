// SPDX-License-Identifier: LicenseRef-Blockscout

import { Spinner } from '@chakra-ui/react';
import { isEqual } from 'es-toolkit';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';
import ColumnFilterContent from 'src/shared/filters/ColumnFilterContent';
import ColumnFilterContentSection from 'src/shared/filters/ColumnFilterContentSection';

import { Checkbox, CheckboxGroup } from 'src/toolkit/chakra/checkbox';

import type { CrossChainColumnFilterField } from './utils';
import { getProtocolOptions, joinFilterValue, splitFilterValue } from './utils';

const FILTER_FIELD: CrossChainColumnFilterField = 'bridge_ids';

const CONFIGURED_BRIDGE_IDS: Array<number> = getFeaturePayload(config.features.crossChainTxs)?.bridgeIds ?? [];

interface Props {
  value: string | undefined;
  handleFilterChange: (field: CrossChainColumnFilterField, value: string | undefined) => void;
}

const ProtocolFilter = ({ value, handleFilterChange }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<Array<string>>(() => splitFilterValue(value));

  const bridgesQuery = useApiQuery('interchainIndexer:bridges', { queryOptions: { refetchOnMount: false } });

  const options = React.useMemo(
    () => getProtocolOptions(bridgesQuery.data?.items, CONFIGURED_BRIDGE_IDS),
    [ bridgesQuery.data?.items ],
  );

  const handleReset = React.useCallback(() => setCurrentValue([]), []);

  const handleFilter = React.useCallback(() => {
    handleFilterChange(FILTER_FIELD, joinFilterValue(currentValue));
  }, [ handleFilterChange, currentValue ]);

  return (
    <ColumnFilterContent
      isTouched={ !isEqual(currentValue.slice().sort(), splitFilterValue(value).sort()) }
      onFilter={ handleFilter }
    >
      <ColumnFilterContentSection title="Protocol" onReset={ handleReset } isFilled={ currentValue.length > 0 }>
        <CheckboxGroup value={ currentValue } onValueChange={ setCurrentValue } orientation="vertical">
          { bridgesQuery.isPending && <Spinner size="md"/> }
          { options.map((option) => (
            <Checkbox key={ option.id } value={ option.id }>
              { option.name }
            </Checkbox>
          )) }
        </CheckboxGroup>
      </ColumnFilterContentSection>
    </ColumnFilterContent>
  );
};

export default React.memo(ProtocolFilter);
