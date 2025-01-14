import { Hide, Show } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { rightLineArrow, nbsp } from 'lib/html-entities';
import { L2_WITHDRAWAL_ITEM } from 'stubs/L2';
import { generateListStub } from 'stubs/utils';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import Skeleton from 'ui/shared/chakra/Skeleton';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import OptimisticL2WithdrawalsListItem from 'ui/withdrawals/optimisticL2/OptimisticL2WithdrawalsListItem';
import OptimisticL2WithdrawalsTable from 'ui/withdrawals/optimisticL2/OptimisticL2WithdrawalsTable';

const OptimisticL2Withdrawals = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'optimistic_l2_withdrawals',
    options: {
      placeholderData: generateListStub<'optimistic_l2_withdrawals'>(
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

  const countersQuery = useApiQuery('optimistic_l2_withdrawals_count', {
    queryOptions: {
      placeholderData: 23700,
    },
  });

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>{ data.items.map(((item, index) => (
        <OptimisticL2WithdrawalsListItem
          key={ String(item.msg_nonce_version) + item.msg_nonce + (isPlaceholderData ? index : '') }
          item={ item }
          isLoading={ isPlaceholderData }
        />
      ))) }</Show>
      <Hide below="lg" ssr={ false }>
        <OptimisticL2WithdrawalsTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
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

export default OptimisticL2Withdrawals;
