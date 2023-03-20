import { Flex, Hide, Show, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { rightLineArrow, nbsp } from 'lib/html-entities';
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

  const countersQuery = useApiQuery('withdrawals_count');

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>{ data.items.map((item => <WithdrawalsListItem key={ item.l2_tx_hash } item={ item }/>)) }</Show>
      <Hide below="lg" ssr={ false }><WithdrawalsTable items={ data.items } top={ isPaginationVisible ? 80 : 0 }/></Hide>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isLoading) {
      return <Skeleton w={{ base: '100%', lg: '320px' }} h="26px" mb={{ base: 6, lg: 7 }} mt={{ base: 0, lg: 7 }}/>;
    }

    if (countersQuery.isError) {
      return null;
    }

    return <Text mb={{ base: 6, lg: 0 }}>A total of { countersQuery.data.toLocaleString('en') } withdrawals found</Text>;
  })();

  const actionBar = (
    <>
      { (isMobile || !isPaginationVisible) && text }
      { isPaginationVisible && (
        <ActionBar mt={ -6 }>
          <Flex alignItems="center" justifyContent="space-between" w="100%">
            { !isMobile && text }
            <Pagination ml="auto" { ...pagination }/>
          </Flex>
        </ActionBar>
      ) }
    </>
  );

  return (
    <Page>
      <PageTitle text={ `Withdrawals (L2${ nbsp }${ rightLineArrow }${ nbsp }L1)` } withTextAd/>
      <DataListDisplay
        isError={ isError }
        isLoading={ isLoading }
        items={ data?.items }
        skeletonProps={{ skeletonDesktopColumns: Array(7).fill(`${ 100 / 7 }%`), skeletonDesktopMinW: '950px' }}
        emptyText="There are no withdrawals."
        content={ content }
        actionBar={ actionBar }
      />
    </Page>
  );
};

export default Withdrawals;
