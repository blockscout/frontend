import { Show, Hide } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import getQueryParamString from 'lib/router/getQueryParamString';
import { generateListStub } from 'stubs/utils';
import { WITHDRAWAL } from 'stubs/withdrawals';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/Pagination';
import WithdrawalsListItem from 'ui/withdrawals/WithdrawalsListItem';
import WithdrawalsTable from 'ui/withdrawals/WithdrawalsTable';

const AddressWithdrawals = ({ scrollRef }: {scrollRef?: React.RefObject<HTMLDivElement>}) => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

  const { data, isPlaceholderData, isError, pagination, isPaginationVisible } = useQueryWithPages({
    resourceName: 'address_withdrawals',
    pathParams: { hash },
    scrollRef,
    options: {
      placeholderData: generateListStub<'address_withdrawals'>(WITHDRAWAL, 50, {
        index: 5,
        items_count: 50,
      }),
    },
  });
  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { data.items.map((item, index) => (
          <WithdrawalsListItem
            key={ item.index + Number(isPlaceholderData ? index : '') }
            item={ item }
            view="address"
            isLoading={ isPlaceholderData }
          />
        )) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <WithdrawalsTable items={ data.items } view="address" top={ isPaginationVisible ? 80 : 0 } isLoading={ isPlaceholderData }/>
      </Hide>
    </>
  ) : null ;

  const actionBar = isPaginationVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      isLoading={ false }
      items={ data?.items }
      skeletonProps={{ isLongSkeleton: true, skeletonDesktopColumns: Array(5).fill(`${ 100 / 5 }%`), skeletonDesktopMinW: '950px' }}
      emptyText="There are no withdrawals for this address."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default AddressWithdrawals;
