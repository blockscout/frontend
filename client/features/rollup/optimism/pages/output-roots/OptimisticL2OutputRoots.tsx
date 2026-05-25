// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'client/shell/page/action-bar/ActionBar';
import PageTitle from 'client/shell/page/title/PageTitle';

import { layerLabels } from 'client/features/rollup/common/utils/layer';
import { L2_OUTPUT_ROOTS_ITEM } from 'client/features/rollup/optimism/stubs';

import DataList from 'client/shared/lists/DataList';
import StickyPaginationWithText from 'client/shared/pagination/StickyPaginationWithText';
import useQueryWithPages from 'client/shared/pagination/useQueryWithPages';
import { generateListStub } from 'client/shared/pagination/utils';

import { Skeleton } from 'toolkit/chakra/skeleton';

import OptimisticL2OutputRootsListItem from './OptimisticL2OutputRootsListItem';
import OptimisticL2OutputRootsTable from './OptimisticL2OutputRootsTable';

const OptimisticL2OutputRoots = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'general:optimistic_l2_output_roots',
    options: {
      placeholderData: generateListStub<'general:optimistic_l2_output_roots'>(
        L2_OUTPUT_ROOTS_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            index: 9045200,
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('general:optimistic_l2_output_roots_count', {
    queryOptions: {
      placeholderData: 50617,
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <OptimisticL2OutputRootsListItem
            key={ item.l2_output_index + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <OptimisticL2OutputRootsTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || isError || !data?.items.length) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isPlaceholderData } display="flex" flexWrap="wrap">
        { layerLabels.current } output index
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[0].l2_output_index } </Text>to
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[data.items.length - 1].l2_output_index } </Text>
        (total of { countersQuery.data?.toLocaleString() } roots)
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title="Output roots" withTextAd/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no output roots."
        actionBar={ actionBar }
      >
        { content }
      </DataList>
    </>
  );
};

export default OptimisticL2OutputRoots;
