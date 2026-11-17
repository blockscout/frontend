// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FlexProps } from '@chakra-ui/react';
import React from 'react';

import type { CrossChainFilters } from 'src/features/cross-chain-txs/types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';

import FilterTagsRow from 'src/shared/filters/FilterTagsRow';

import type { CrossChainColumnFilterField, CrossChainFilterChangeHandler } from './utils';
import { getCrossChainFilterTags, hasActiveColumnFilters } from './utils';

interface Props extends FlexProps {
  filters: CrossChainFilters;
  onFilterChange: CrossChainFilterChangeHandler;
}

const CrossChainFilterTags = ({ filters, onFilterChange, ...rest }: Props) => {
  const isActive = hasActiveColumnFilters(filters);

  const chainsQuery = useApiQuery('interchainIndexer:chains', { queryOptions: { enabled: isActive, refetchOnMount: false } });
  const bridgesQuery = useApiQuery('interchainIndexer:bridges', { queryOptions: { enabled: isActive, refetchOnMount: false } });

  const tags = React.useMemo(
    () => getCrossChainFilterTags(
      filters,
      chainsQuery.data?.items,
      bridgesQuery.data?.items,
      { chains: chainsQuery.isPending, bridges: bridgesQuery.isPending },
    ),
    [ filters, chainsQuery.data?.items, bridgesQuery.data?.items, chainsQuery.isPending, bridgesQuery.isPending ],
  );

  const handleClear = React.useCallback((field: CrossChainColumnFilterField) => {
    onFilterChange({ ...filters, [field]: undefined });
  }, [ filters, onFilterChange ]);

  const handleClearAll = React.useCallback(() => {
    onFilterChange({ q: filters.q });
  }, [ filters.q, onFilterChange ]);

  if (!isActive) {
    return null;
  }

  return <FilterTagsRow tags={ tags } onClear={ handleClear } onClearAll={ handleClearAll } { ...rest }/>;
};

export default React.memo(CrossChainFilterTags);
