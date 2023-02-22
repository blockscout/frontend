import { Flex, Hide, Show, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import OutputRootsListItem from 'ui/outputRoots/OutputRootsListItem';
import OutputRootsTable from 'ui/outputRoots/OutputRootsTable';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';

const OutputRoots = () => {
  const isMobile = useIsMobile();

  const { data, isError, isLoading, isPaginationVisible, pagination } = useQueryWithPages({
    resourceName: 'output_roots',
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
          <SkeletonTable minW="900px" display={{ base: 'none', lg: 'block' }} columns={ [ '140px', '20%', '20%', '30%', '30%' ] }/>
        </>
      );
    }

    const text = (
      <Flex mb={{ base: 6, lg: 0 }} flexWrap="wrap">
        L2 output index
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[0].l2_output_index } </Text>to
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[data.items.length - 1].l2_output_index } </Text>
        (total of { data.total.toLocaleString('en') } roots)
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
        <Show below="lg" ssr={ false }>{ data.items.map((item => <OutputRootsListItem key={ item.l2_output_index } { ...item }/>)) }</Show>
        <Hide below="lg" ssr={ false }><OutputRootsTable items={ data.items } top={ isPaginationVisible ? 80 : 0 }/></Hide>
      </>
    );
  })();

  return (
    <Page>
      <PageTitle text="Output roots" withTextAd/>
      { content }
    </Page>
  );
};

export default OutputRoots;
