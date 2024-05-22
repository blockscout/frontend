import { Hide, Show, Skeleton } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { rightLineArrow, nbsp } from 'lib/html-entities';
import { generateListStub } from 'stubs/utils';
import { ZKEVM_WITHDRAWALS_ITEM } from 'stubs/zkEvmL2';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import ZkEvmL2WithdrawalsListItem from 'ui/withdrawals/zkEvmL2/ZkEvmL2WithdrawalsListItem';
import ZkEvmL2WithdrawalsTable from 'ui/withdrawals/zkEvmL2/ZkEvmL2WithdrawalsTable';

const ZkEvmL2Withdrawals = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'zkevm_l2_withdrawals',
    options: {
      placeholderData: generateListStub<'zkevm_l2_withdrawals'>(
        ZKEVM_WITHDRAWALS_ITEM,
        50,
        { next_page_params: { items_count: 50, index: 1 } },
      ),
    },
  });

  const countersQuery = useApiQuery('zkevm_l2_withdrawals_count', {
    queryOptions: {
      placeholderData: 1927029,
    },
  });

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { data.items.map(((item, index) => (
          <ZkEvmL2WithdrawalsListItem
            key={ String(item.index) + (isPlaceholderData ? index : '') }
            isLoading={ isPlaceholderData }
            item={ item }
          />
        ))) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <ZkEvmL2WithdrawalsTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
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

export default ZkEvmL2Withdrawals;
