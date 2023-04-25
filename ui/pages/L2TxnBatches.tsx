import { Flex, Hide, Show, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { nbsp } from 'lib/html-entities';
import TxnBatchesListItem from 'ui/l2TxnBatches/TxnBatchesListItem';
import TxnBatchesTable from 'ui/l2TxnBatches/TxnBatchesTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';

const L2TxnBatches = () => {
  const isMobile = useIsMobile();

  const { data, isError, isLoading, isPaginationVisible, pagination } = useQueryWithPages({
    resourceName: 'l2_txn_batches',
  });

  const countersQuery = useApiQuery('l2_txn_batches_count');

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>{ data.items.map((item => <TxnBatchesListItem key={ item.l2_block_number } item={ item }/>)) }</Show>
      <Hide below="lg" ssr={ false }><TxnBatchesTable items={ data.items } top={ isPaginationVisible ? 80 : 0 }/></Hide>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isLoading || isLoading) {
      return (
        <Skeleton
          w={{ base: '100%', lg: '400px' }}
          h={{ base: '48px', lg: '24px' }}
          mb={{ base: 6, lg: isPaginationVisible ? 0 : 7 }}
          mt={{ base: 0, lg: isPaginationVisible ? 0 : 7 }}
        />
      );
    }

    if (countersQuery.isError || isError || data.items.length === 0) {
      return null;
    }

    return (
      <Flex mb={{ base: 6, lg: isPaginationVisible ? 0 : 6 }} flexWrap="wrap">
      Tx batch (L2 block)
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[0].l2_block_number } </Text>to
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[data.items.length - 1].l2_block_number } </Text>
      (total of { countersQuery.data.toLocaleString() } batches)
      </Flex>
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
      <PageTitle text={ `Tx batches (L2${ nbsp }blocks)` } withTextAd/>
      <DataListDisplay
        isError={ isError }
        isLoading={ isLoading }
        items={ data?.items }
        skeletonProps={{ skeletonDesktopColumns: [ '170px', '170px', '160px', '100%', '150px' ] }}
        emptyText="There are no tx batches."
        content={ content }
        actionBar={ actionBar }
      />
    </Page>
  );
};

export default L2TxnBatches;
