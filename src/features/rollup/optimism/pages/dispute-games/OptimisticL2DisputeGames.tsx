// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import { L2_DISPUTE_GAMES_ITEM } from 'src/features/rollup/optimism/stubs';

import DataList from 'src/shared/lists/DataList';
import StickyPaginationWithText from 'src/shared/pagination/StickyPaginationWithText';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import OptimisticL2DisputeGamesTable from './OptimisticL2DisputeGamesTable';

const OptimisticL2DisputeGames = () => {
  const { data, isError, isInitialLoading, isTransitioning, pagination, queryHash } = useApiPaginatedQuery({
    resourceName: 'core:optimistic_l2_dispute_games',
    options: {
      placeholderData: generateListStub<'core:optimistic_l2_dispute_games'>(
        L2_DISPUTE_GAMES_ITEM,
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

  const countersQuery = useApiQuery('core:optimistic_l2_dispute_games_count', {
    queryOptions: {
      placeholderData: 50617,
    },
  });

  const content = data?.items ? (
    <TableContainerScrollable>
      <OptimisticL2DisputeGamesTable
        items={ data.items }
        top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
        isLoading={ isInitialLoading }
        resetKey={ queryHash }
      />
    </TableContainerScrollable>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || isError || !data?.items.length) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isInitialLoading } display="flex" flexWrap="wrap">
        Dispute game index
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[0].index } </Text>to
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[data.items.length - 1].index } </Text>
        (total of { countersQuery.data?.toLocaleString() } games)
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title="Dispute games" withTextAd/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no dispute games."
        actionBar={ actionBar }
        isTransitioning={ isTransitioning }
      >
        { content }
      </DataList>
    </>
  );
};

export default OptimisticL2DisputeGames;
