import { Flex, Hide, Show } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';
import WithdrawalsListItem from 'ui/withdrawals/WithdrawalsListItem';
import WithdrawalsTable from 'ui/withdrawals/WithdrawalsTable';

const Withdrawals = () => {
  const isMobile = useIsMobile();

  const { data, isError, isLoading, isPaginationVisible, pagination } = useQueryWithPages({
    resourceName: 'withdrawals',
  });

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>{ data.items.map((item => <WithdrawalsListItem key={ item.index } item={ item } view="list"/>)) }</Show>
      <Hide below="lg" ssr={ false }><WithdrawalsTable items={ data.items } view="list" top={ isPaginationVisible ? 80 : 0 }/></Hide>
    </>
  ) : null;

  const actionBar = isPaginationVisible ? (
    <ActionBar mt={ -6 }>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        { !isMobile }
        <Pagination ml="auto" { ...pagination }/>
      </Flex>
    </ActionBar>
  ) : null;

  return (
    <Page>
      <PageTitle text="Withdrawals" withTextAd/>
      <DataListDisplay
        isError={ isError }
        isLoading={ isLoading }
        items={ data?.items }
        skeletonProps={{ skeletonDesktopColumns: Array(6).fill(`${ 100 / 6 }%`), skeletonDesktopMinW: '950px' }}
        emptyText="There are no withdrawals."
        content={ content }
        actionBar={ actionBar }
      />
    </Page>
  );
};

export default Withdrawals;
