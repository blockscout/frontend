import { Hide, Show, Skeleton } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { rightLineArrow, nbsp } from 'lib/html-entities';
import { L2_DEPOSIT_ITEM } from 'stubs/L2';
import { generateListStub } from 'stubs/utils';
import OptimisticDepositsListItem from 'ui/deposits/optimisticL2/OptimisticDepositsListItem';
import OptimisticDepositsTable from 'ui/deposits/optimisticL2/OptimisticDepositsTable';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

const OptimisticL2Deposits = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'l2_deposits',
    options: {
      placeholderData: generateListStub<'l2_deposits'>(
        L2_DEPOSIT_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            l1_block_number: 9045200,
            tx_hash: '',
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('l2_deposits_count', {
    queryOptions: {
      placeholderData: 1927029,
    },
  });

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { data.items.map(((item, index) => (
          <OptimisticDepositsListItem
            key={ item.l2_tx_hash + (isPlaceholderData ? index : '') }
            isLoading={ isPlaceholderData }
            item={ item }
          />
        ))) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <OptimisticDepositsTable items={ data.items } top={ pagination.isVisible ? 80 : 0 } isLoading={ isPlaceholderData }/>
      </Hide>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError) {
      return null;
    }

    return (
      <Skeleton
        isLoaded={ !countersQuery.isPlaceholderData }
        display="inline-block"
      >
        A total of { countersQuery.data?.toLocaleString() } deposits found
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title={ `Deposits (L1${ nbsp }${ rightLineArrow }${ nbsp }L2)` } withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no withdrawals."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default OptimisticL2Deposits;
