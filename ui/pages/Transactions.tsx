import {
  Box,
} from '@chakra-ui/react';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import appConfig from 'configs/app/config';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
import TxsPending from 'ui/txs/TxsPending';
import TxsValidated from 'ui/txs/TxsValidated';

const Transactions = () => {

  const verifiedTitle = appConfig.network.verificationType === 'validation' ? 'Validated' : 'Mined';
  const TABS: Array<RoutedTab> = [
    { id: 'validated', title: verifiedTitle, component: <TxsValidated/> },
    { id: 'pending', title: 'Pending', component: <TxsPending/> },
  ];

  return (
    <Page>
      <Box h="100%">
        <PageTitle text="Transactions"/>
        <RoutedTabs tabs={ TABS }/>
      </Box>
    </Page>
  );
};

export default Transactions;
