import { Flex, Hide, Show, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { rightLineArrow, nbsp } from 'lib/html-entities';
import DepositsListItem from 'ui/deposits/DepositsListItem';
import DepositsTable from 'ui/deposits/DepositsTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';

const Deposits = () => {
  const isMobile = useIsMobile();

  const { data, isError, isLoading, isPaginationVisible, pagination } = useQueryWithPages({
    resourceName: 'deposits',
  });

  const countersQuery = useApiQuery('deposits_count');

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>{ data.items.map((item => <DepositsListItem key={ item.l2_tx_hash } item={ item }/>)) }</Show>
      <Hide below="lg" ssr={ false }><DepositsTable items={ data.items } top={ isPaginationVisible ? 80 : 0 }/></Hide>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isLoading) {
      return (
        <Skeleton
          w={{ base: '100%', lg: '320px' }}
          h="24px"
          mb={{ base: 7, lg: isPaginationVisible ? 0 : 7 }}
          mt={{ base: 1, lg: isPaginationVisible ? 0 : 7 }}
        />
      );
    }

    if (countersQuery.isError) {
      return null;
    }

    return (
      <Text mb={{ base: 6, lg: isPaginationVisible ? 0 : 6 }} lineHeight={{ base: '24px', lg: '32px' }}>
        A total of { countersQuery.data.toLocaleString('en') } deposits found
      </Text>
    );
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
      <PageTitle text={ `Deposits (L1${ nbsp }${ rightLineArrow }${ nbsp }L2)` } withTextAd/>
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

export default Deposits;
