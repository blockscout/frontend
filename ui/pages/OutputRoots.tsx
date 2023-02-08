import { Flex, Hide, Show, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import dataMock from 'data/outputRoots.json';
import isBrowser from 'lib/isBrowser';
import OutputRootsListItem from 'ui/outputRoots/OutputRootsListItem';
import OutputRootsTable from 'ui/outputRoots/OutputRootsTable';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';

const OutputRoots = () => {
  // request!!
  const [ isLoading, setIsLoading ] = React.useState(true);
  React.useEffect(() => {
    if (isBrowser()) {
      setTimeout(() => setIsLoading(false), 2000);
    }
  }, []);

  const data = dataMock;
  const isPaginationVisible = false;

  const content = (() => {
    if (isLoading) {
      return (
        <>
          <SkeletonList display={{ base: 'block', lg: 'none' }}/>
          <SkeletonTable display={{ base: 'none', lg: 'block' }} columns={ [ '130px', '120px', '15%', '45%', '35%' ] }/>
        </>
      );
    }
    return (
      <>
        <Show below="lg" ssr={ false }>{ data.items.map((item => <OutputRootsListItem key={ item.l2_output_index } { ...item }/>)) }</Show>
        <Hide below="lg" ssr={ false }><OutputRootsTable items={ data.items } top={ isPaginationVisible ? 80 : 0 }/></Hide>
      </>
    );
  })();

  return (
    <Page>
      <PageTitle text="Output roots" withTextAd/>
      { isLoading ? <Skeleton w="400px" h="26px" mb={ 7 }/> : (
        <Flex mb={ 7 } flexWrap="wrap">
          L2 output index
          <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[0].l2_output_index } </Text>to
          <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[dataMock.items.length - 1].l2_output_index } </Text>
          (total of { data.total.toLocaleString('en') } roots)
        </Flex>
      ) }
      { /* Pagination */ }
      { content }
    </Page>
  );
};

export default OutputRoots;
