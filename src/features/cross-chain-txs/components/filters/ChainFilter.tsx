// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Spinner, chakra } from '@chakra-ui/react';
import { isEqual } from 'es-toolkit';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import ChainIcon from 'src/shared/external-chains/ChainIcon';
import ColumnFilterContent from 'src/shared/filters/ColumnFilterContent';
import ColumnFilterContentSection from 'src/shared/filters/ColumnFilterContentSection';

import { Checkbox, CheckboxGroup } from 'src/toolkit/chakra/checkbox';
import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

import type { CrossChainColumnFilterField } from './utils';
import { filterChainOptions, joinFilterValue, splitFilterValue } from './utils';

export const SEARCH_THRESHOLD = 10;

const DIRECTIONS = {
  source: { field: 'src_chain_ids', title: 'Source tx chains' },
  destination: { field: 'dst_chain_ids', title: 'Destination tx chains' },
} as const satisfies Record<string, { field: CrossChainColumnFilterField; title: string }>;

export type ChainFilterDirection = keyof typeof DIRECTIONS;

interface Props {
  direction: ChainFilterDirection;
  value: string | undefined;
  handleFilterChange: (field: CrossChainColumnFilterField, value: string | undefined) => void;
}

const ChainFilter = ({ direction, value, handleFilterChange }: Props) => {
  const { field, title } = DIRECTIONS[direction];
  const [ currentValue, setCurrentValue ] = React.useState<Array<string>>(() => splitFilterValue(value));
  const [ searchTerm, setSearchTerm ] = React.useState('');

  const chainsQuery = useApiQuery('interchainIndexer:chains', { queryOptions: { refetchOnMount: false } });

  const chains = chainsQuery.data?.items;
  const hasSearch = (chains?.length ?? 0) >= SEARCH_THRESHOLD;
  const visibleChains = React.useMemo(() => filterChainOptions(chains, searchTerm), [ chains, searchTerm ]);

  const handleReset = React.useCallback(() => setCurrentValue([]), []);

  const handleFilter = React.useCallback(() => {
    handleFilterChange(field, joinFilterValue(currentValue));
  }, [ handleFilterChange, field, currentValue ]);

  return (
    <ColumnFilterContent
      isTouched={ !isEqual(currentValue.slice().sort(), splitFilterValue(value).sort()) }
      onFilter={ handleFilter }
    >
      <ColumnFilterContentSection title={ title } onReset={ handleReset } isFilled={ currentValue.length > 0 }>
        { hasSearch && (
          <FilterInput
            size="sm"
            onChange={ setSearchTerm }
            placeholder="Find by chain name or chain ID"
          />
        ) }
        { chainsQuery.isPending && <Spinner size="md"/> }
        { chainsQuery.isError && <span>Something went wrong. Please try again.</span> }
        { chains && visibleChains.length === 0 && <span>No results found.</span> }
        { visibleChains.length > 0 && (
          <Flex flexDir="column" maxH="250px" overflowY="auto">
            <CheckboxGroup value={ currentValue } onValueChange={ setCurrentValue } orientation="vertical">
              { visibleChains.map((chain) => (
                <Checkbox key={ chain.id } value={ chain.id } labelProps={{ minW: 0 }}>
                  <Flex alignItems="center" columnGap={ 2 } minW={ 0 }>
                    <ChainIcon data={ chain } alt={ `${ chain.name } logo` } noTooltip flexShrink={ 0 }/>
                    <chakra.span overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                      { chain.name || `Chain ${ chain.id }` }
                    </chakra.span>
                  </Flex>
                </Checkbox>
              )) }
            </CheckboxGroup>
          </Flex>
        ) }
      </ColumnFilterContentSection>
    </ColumnFilterContent>
  );
};

export default React.memo(ChainFilter);
