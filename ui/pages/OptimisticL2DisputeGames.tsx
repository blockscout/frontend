import { Hide, Show, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { L2_DISPUTE_GAMES_ITEM } from 'stubs/L2';
import { generateListStub } from 'stubs/utils';
import OptimisticL2DisputeGamesListItem from 'ui/disputeGames/optimisticL2/OptimisticL2DisputeGamesListItem';
import OptimisticL2DisputeGamesTable from 'ui/disputeGames/optimisticL2/OptimisticL2DisputeGamesTable';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

const OptimisticL2DisputeGames = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'optimistic_l2_dispute_games',
    options: {
      placeholderData: generateListStub<'optimistic_l2_dispute_games'>(
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

  const countersQuery = useApiQuery('optimistic_l2_dispute_games_count', {
    queryOptions: {
      placeholderData: 50617,
    },
  });

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { data.items.map(((item, index) => (
          <OptimisticL2DisputeGamesListItem
            key={ item.index + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <OptimisticL2DisputeGamesTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Hide>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || isError || !data?.items.length) {
      return null;
    }

    return (
      <Skeleton isLoaded={ !countersQuery.isPlaceholderData && !isPlaceholderData } display="flex" flexWrap="wrap">
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
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no dispute games."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default OptimisticL2DisputeGames;
