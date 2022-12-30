import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import appConfig from 'configs/app/config';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
import TxsContent from 'ui/txs/TxsContent';
import TxsTabSlot from 'ui/txs/TxsTabSlot';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  py: 5,
  marginTop: -5,
};

const Transactions = () => {
  const verifiedTitle = appConfig.network.verificationType === 'validation' ? 'Validated' : 'Mined';
  const router = useRouter();
  const isMobile = useIsMobile();
  const filter = router.query.tab === 'pending' ? 'pending' : 'validated';
  const txsQuery = useQueryWithPages({
    resourceName: filter === 'validated' ? 'txs_validated' : 'txs_pending',
    filters: { filter },
  });

  const tabs: Array<RoutedTab> = [
    { id: 'validated', title: verifiedTitle, component: <TxsContent query={ txsQuery }/> },
    { id: 'pending', title: 'Pending', component: <TxsContent query={ txsQuery } showBlockInfo={ false }/> },
  ];

  return (
    <Page hideMobileHeaderOnScrollDown>
      <Box h="100%">
        <PageTitle text="Transactions"/>
        <RoutedTabs
          tabs={ tabs }
          tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
          rightSlot={ <TxsTabSlot pagination={ txsQuery.pagination } isPaginationVisible={ txsQuery.isPaginationVisible && !isMobile }/> }
          stickyEnabled={ !isMobile }
        />
      </Box>
    </Page>
  );
};

export default Transactions;
