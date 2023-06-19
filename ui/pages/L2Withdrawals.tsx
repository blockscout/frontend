import { Box, Hide, Show, Skeleton } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { rightLineArrow, nbsp } from 'lib/html-entities';
import { L2_WITHDRAWAL_ITEM } from 'stubs/L2';
import { generateListStub } from 'stubs/utils';
import WithdrawalsListItem from 'ui/l2Withdrawals/WithdrawalsListItem';
import WithdrawalsTable from 'ui/l2Withdrawals/WithdrawalsTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const L2Withdrawals = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'l2_withdrawals',
    options: {
      placeholderData: generateListStub<'l2_withdrawals'>(
        L2_WITHDRAWAL_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            nonce: '',
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('l2_withdrawals_count', {
    queryOptions: {
      placeholderData: 23700,
    },
  });

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>{ data.items.map(((item, index) => (
        <WithdrawalsListItem
          key={ item.l2_tx_hash + (isPlaceholderData ? index : '') }
          item={ item }
          isLoading={ isPlaceholderData }
        />
      ))) }</Show>
      <Hide below="lg" ssr={ false }>
        <WithdrawalsTable items={ data.items } top={ pagination.isVisible ? 80 : 0 } isLoading={ isPlaceholderData }/>
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
        A total of { countersQuery.data?.toLocaleString() } withdrawals found
      </Skeleton>
    );
  })();

  const actionBar = (
    <>
      <Box mb={ 6 } display={{ base: 'block', lg: 'none' }}>
        { text }
      </Box>
      <ActionBar mt={ -6 }>
        <Box display={{ base: 'none', lg: 'block' }}>
          { text }
        </Box>
        { pagination.isVisible && <Pagination ml="auto" { ...pagination }/> }
      </ActionBar>
    </>
  );

  return (
    <>
      <PageTitle title={ `Withdrawals (L2${ nbsp }${ rightLineArrow }${ nbsp }L1)` } withTextAd/>
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

export default L2Withdrawals;
