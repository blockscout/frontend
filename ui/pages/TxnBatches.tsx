import { Flex, Hide, Show, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { nbsp } from 'lib/html-entities';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import TxnBatchesListItem from 'ui/txnBatches/TxnBatchesListItem';
import TxnBatchesTable from 'ui/txnBatches/TxnBatchesTable';

const TxnBatches = () => {
  const isMobile = useIsMobile();

  const { data, isError, isLoading, isPaginationVisible, pagination } = useQueryWithPages({
    resourceName: 'txn_batches',
  });

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    if (isLoading) {
      return (
        <>
          <Skeleton w={{ base: '100%', lg: '400px' }} h={{ base: '48px', lg: '26px' }} mb={{ base: 6, lg: 7 }} mt={{ base: 0, lg: 7 }}/>
          <SkeletonList display={{ base: 'block', lg: 'none' }}/>
          <SkeletonTable display={{ base: 'none', lg: 'block' }} columns={ [ '170px', '170px', '160px', '100%', '150px' ] }/>
        </>
      );
    }

    const text = (
      <Flex mb={{ base: 6, lg: 0 }} flexWrap="wrap">
        Tx batch (L2 block)
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[0].l2_block_number } </Text>to
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[data.items.length - 1].l2_block_number } </Text>
        (total of { data.total.toLocaleString('en') } batches)
      </Flex>
    );

    return (
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
        <Show below="lg" ssr={ false }>{ data.items.map((item => <TxnBatchesListItem key={ item.l2_block_number } item={ item }/>)) }</Show>
        <Hide below="lg" ssr={ false }><TxnBatchesTable items={ data.items } top={ isPaginationVisible ? 80 : 0 }/></Hide>
      </>
    );
  })();

  return (
    <Page>
      <PageTitle text={ `Tx batches (L2${ nbsp }blocks)` } withTextAd/>
      { content }
    </Page>
  );
};

export default TxnBatches;
