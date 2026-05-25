// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, createListCollection } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { ChainMetricsSorting, ChainMetricsSortingField, ChainMetricsSortingValue } from 'client/features/multichain/types/client';

import useApiQuery from 'client/api/hooks/useApiQuery';

import PageTitle from 'client/shell/page/title/PageTitle';

import { CHAIN_METRICS } from 'client/features/multichain/stubs';

import DataList from 'client/shared/lists/DataList';
import getSortParamsFromValue from 'client/shared/sort/get-sort-params-from-value';
import getSortValueFromQuery from 'client/shared/sort/get-sort-value-from-query';
import Sort from 'client/shared/sort/Sort';

import multichainConfig from 'configs/multichain';
import ActionBar from 'ui/shared/ActionBar';

import MultichainEcosystemsListItem from './MultichainEcosystemsListItem';
import MultichainEcosystemsTable from './MultichainEcosystemsTable';
import { SORT_OPTIONS } from './utils';

const sortCollection = createListCollection({
  items: SORT_OPTIONS,
});

const MultichainEcosystems = () => {
  const router = useRouter();

  const [ sort, setSort ] =
  React.useState<ChainMetricsSortingValue>(getSortValueFromQuery<ChainMetricsSortingValue>(router.query, SORT_OPTIONS) ?? 'default');

  const { data, isError, isPlaceholderData } = useApiQuery('multichainAggregator:chain_metrics', {
    queryParams: getSortParamsFromValue<ChainMetricsSortingValue, ChainMetricsSortingField, ChainMetricsSorting['order']>(sort),
    queryOptions: {
      placeholderData: { items: Array(10).fill(CHAIN_METRICS) },
    },
  });

  const chains = multichainConfig()?.chains;

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSort(value[0] as ChainMetricsSortingValue);
  }, [ setSort ]);

  const content = data?.items ? (
    <>
      <Box hideBelow="lg">
        <MultichainEcosystemsTable
          data={ data.items }
          sort={ sort }
          setSorting={ handleSortChange }
          isLoading={ isPlaceholderData }
        />
      </Box>
      <Box hideFrom="lg">
        <ActionBar>
          <Sort
            name="chain_metrics_sorting"
            defaultValue={ [ sort ] }
            collection={ sortCollection }
            onValueChange={ handleSortChange }
            isLoading={ isPlaceholderData }
          />
        </ActionBar>
        { data.items.map((item, index) => (
          <MultichainEcosystemsListItem
            key={ item.chain_id + (isPlaceholderData ? String(index) : '') }
            data={ item }
            chainInfo={ chains?.find((chain) => chain.id === item.chain_id) }
            isLoading={ isPlaceholderData }
          />
        )) }
      </Box>
    </>
  ) : null;

  return (
    <>
      <PageTitle
        title="Ecosystems"
        withTextAd
      />
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no chains in the cluster."
      >
        { content }
      </DataList>
    </>
  );
};

export default React.memo(MultichainEcosystems);
