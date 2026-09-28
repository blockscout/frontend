// SPDX-License-Identifier: LicenseRef-Blockscout

import { createListCollection } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { ChainMetricsSorting, ChainMetricsSortingField, ChainMetricsSortingValue } from 'src/features/multichain/types/client';

import useApiQuery from 'src/api/hooks/useApiQuery';

import ActionBar from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import { CHAIN_METRICS } from 'src/features/multichain/stubs';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import getSortParamsFromValue from 'src/shared/sort/get-sort-params-from-value';
import getSortValueFromQuery from 'src/shared/sort/get-sort-value-from-query';
import Sort from 'src/shared/sort/Sort';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import MultichainEcosystemsTable from './MultichainEcosystemsTable';
import { SORT_OPTIONS } from './utils';

const sortCollection = createListCollection({
  items: SORT_OPTIONS,
});

const MultichainEcosystems = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [ sort, setSort ] =
  React.useState<ChainMetricsSortingValue>(getSortValueFromQuery<ChainMetricsSortingValue>(router.query, SORT_OPTIONS) ?? 'default');

  const { data, isError, isPlaceholderData } = useApiQuery('multichainAggregator:chain_metrics', {
    queryParams: getSortParamsFromValue<ChainMetricsSortingValue, ChainMetricsSortingField, ChainMetricsSorting['order']>(sort),
    queryOptions: {
      placeholderData: { items: Array(10).fill(CHAIN_METRICS) },
    },
  });

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSort(value[0] as ChainMetricsSortingValue);
  }, [ setSort ]);

  const content = data?.items ? (
    <TableContainerScrollable>
      <MultichainEcosystemsTable
        data={ data.items }
        sort={ sort }
        setSorting={ handleSortChange }
        isLoading={ isPlaceholderData }
        resetKey={ sort }
      />
    </TableContainerScrollable>
  ) : null;

  const actionBar = isMobile ? (
    <ActionBar>
      <Sort
        name="chain_metrics_sorting"
        defaultValue={ [ sort ] }
        collection={ sortCollection }
        onValueChange={ handleSortChange }
        isLoading={ isPlaceholderData }
        hideFrom="lg"
      />
    </ActionBar>
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
        actionBar={ actionBar }
      >
        { content }
      </DataList>
    </>
  );
};

export default React.memo(MultichainEcosystems);
