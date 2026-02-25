import { Box, createListCollection } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { ChainMetricsSorting, ChainMetricsSortingField, ChainMetricsSortingValue } from 'types/client/multichain-aggregator';

import multichainConfig from 'configs/multichain';
import useApiQuery from 'lib/api/useApiQuery';
import { CHAIN_METRICS } from 'stubs/optimismSuperchain';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import Sort from 'ui/shared/sort/Sort';

import OpSuperchainEcosystemsListItem from './OpSuperchainEcosystemsListItem';
import OpSuperchainEcosystemsTable from './OpSuperchainEcosystemsTable';
import { SORT_OPTIONS } from './utils';

const sortCollection = createListCollection({
  items: SORT_OPTIONS,
});

const OpSuperchainEcosystems = () => {
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
        <OpSuperchainEcosystemsTable
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
          <OpSuperchainEcosystemsListItem
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
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no chains in the cluster."
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default React.memo(OpSuperchainEcosystems);
