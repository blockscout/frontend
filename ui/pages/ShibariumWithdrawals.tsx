import { Hide, Show, Skeleton } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { rightLineArrow, nbsp } from 'lib/html-entities';
import { SHIBARIUM_WITHDRAWAL_ITEM } from 'stubs/shibarium';
import { generateListStub } from 'stubs/utils';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import WithdrawalsListItem from 'ui/withdrawals/shibarium/WithdrawalsListItem';
import WithdrawalsTable from 'ui/withdrawals/shibarium/WithdrawalsTable';

const L2Withdrawals = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'shibarium_withdrawals',
    options: {
      placeholderData: generateListStub<'shibarium_withdrawals'>(
        SHIBARIUM_WITHDRAWAL_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            block_number: 123,
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('shibarium_withdrawals_count', {
    queryOptions: {
      placeholderData: 23700,
    },
  });

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>{ data.items.map(((item, index) => (
        <WithdrawalsListItem
          key={ item.l2_transaction_hash + (isPlaceholderData ? index : '') }
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

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

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
