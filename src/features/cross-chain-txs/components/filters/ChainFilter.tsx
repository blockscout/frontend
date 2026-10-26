// SPDX-License-Identifier: LicenseRef-Blockscout

import { isEqual } from 'es-toolkit';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import ChainSelect, { ALL_OPTION, isAllOption } from 'src/shared/external-chains/ChainSelect';
import ColumnFilterContent from 'src/shared/filters/ColumnFilterContent';
import ColumnFilterContentSection from 'src/shared/filters/ColumnFilterContentSection';

import type { OnValueChangeHandler } from 'src/toolkit/chakra/select';

import type { CrossChainColumnFilterField } from './utils';
import { joinFilterValue, splitFilterValue } from './utils';

const ALL_VALUE = [ ALL_OPTION.value ];

const DIRECTIONS = {
  source: { field: 'src_chain_ids', title: 'Source tx' },
  destination: { field: 'dst_chain_ids', title: 'Destination tx' },
} as const satisfies Record<string, { field: CrossChainColumnFilterField; title: string }>;

export type ChainFilterDirection = keyof typeof DIRECTIONS;

interface Props {
  direction: ChainFilterDirection;
  value: string | undefined;
  handleFilterChange: (field: CrossChainColumnFilterField, value: string | undefined) => void;
}

function toSelectValue(value: string | undefined): Array<string> {
  const ids = splitFilterValue(value);
  return ids.length > 0 ? ids : ALL_VALUE;
}

const ChainFilter = ({ direction, value, handleFilterChange }: Props) => {
  const { field, title } = DIRECTIONS[direction];
  const [ currentValue, setCurrentValue ] = React.useState<Array<string>>(() => toSelectValue(value));

  const chainsQuery = useApiQuery('interchainIndexer:chains', { queryOptions: { refetchOnMount: false } });

  const chainsConfig = React.useMemo(() => {
    return chainsQuery.data?.items.map((chain) => ({
      id: chain.id,
      name: chain.name,
      logo: chain.logo,
    })) ?? [];
  }, [ chainsQuery.data?.items ]);

  const handleValueChange: OnValueChangeHandler = React.useCallback(({ value }) => {
    setCurrentValue(value);
  }, []);

  const handleReset = React.useCallback(() => setCurrentValue(ALL_VALUE), []);

  const handleFilter = React.useCallback(() => {
    handleFilterChange(field, isAllOption(currentValue) ? undefined : joinFilterValue(currentValue));
  }, [ handleFilterChange, field, currentValue ]);

  return (
    <ColumnFilterContent
      isTouched={ !isEqual(currentValue.slice().sort(), toSelectValue(value).slice().sort()) }
      onFilter={ handleFilter }
    >
      <ColumnFilterContentSection title={ title } onReset={ handleReset } isFilled={ !isAllOption(currentValue) }>
        <ChainSelect
          value={ currentValue }
          onValueChange={ handleValueChange }
          chainsConfig={ chainsConfig }
          loading={ chainsQuery.isPending }
          withAllOption
          multiple
          w="100%"
        />
      </ColumnFilterContentSection>
    </ColumnFilterContent>
  );
};

export default React.memo(ChainFilter);
