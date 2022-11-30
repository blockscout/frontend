import {
  Box,
} from '@chakra-ui/react';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import appConfig from 'configs/app/config';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
import TxsTab from 'ui/txs/TxsTab';

const Transactions = () => {
  const verifiedTitle = appConfig.network.verificationType === 'validation' ? 'Validated' : 'Mined';
  const TABS: Array<RoutedTab> = [
    { id: 'validated', title: verifiedTitle, component: <TxsTab tab="validated"/> },
    { id: 'pending', title: 'Pending', component: <TxsTab tab="pending"/> },
  ];

  return (
    <Page hideMobileHeaderOnScrollDown>
      <Box h="100%">
        <PageTitle text="Transactions"/>
        <RoutedTabs tabs={ TABS }/>
      </Box>
    </Page>
  );
};

export default Transactions;
