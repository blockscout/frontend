import { Flex, Hide, Show, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import { data as dataMock } from 'data/withdrawals';
import { rightLineArrow } from 'lib/html-entities';
import isBrowser from 'lib/isBrowser';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import WithdrawalsListItem from 'ui/withdrawals/WithdrawalsListItem';
import WithdrawalsTable from 'ui/withdrawals/WithdrawalsTable';

const Withdrawals = () => {
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
          { /* !!! */ }
          <SkeletonTable display={{ base: 'none', lg: 'block' }} columns={ [ '130px', '120px', '15%', '45%', '35%' ] }/>
        </>
      );
    }
    return (
      <>
        <Show below="lg" ssr={ false }>{ data.items.map((item => <WithdrawalsListItem key={ item.l2_tx_hash } { ...item }/>)) }</Show>
        <Hide below="lg" ssr={ false }><WithdrawalsTable items={ data.items } top={ isPaginationVisible ? 80 : 0 }/></Hide>
      </>
    );
  })();

  return (
    <Page>
      <PageTitle text={ `Withdrawals (L2 ${ rightLineArrow } L1)` } withTextAd/>
      { isLoading ? <Skeleton w="400px" h="26px" mb={ 7 }/> : <Text>A total of { data.total } withdrawals found</Text> }
      { /* Pagination */ }
      { content }
    </Page>
  );
};

export default Withdrawals;
