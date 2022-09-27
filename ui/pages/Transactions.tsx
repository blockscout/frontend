import {
  Box,
} from '@chakra-ui/react';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import Page from 'ui/shared/Page';
import PageHeader from 'ui/shared/PageHeader';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
import TxsPending from 'ui/txs/TxsPending';
import TxsValidated from 'ui/txs/TxsValidated';

const TABS: Array<RoutedTab> = [
  { routeName: 'txs_validated', title: 'Validated', component: <TxsValidated/> },
  { routeName: 'txs_pending', title: 'Pending', component: <TxsPending/> },
];

type Props = {
  tab: RoutedTab['routeName'];
}

const Transactions = ({ tab }: Props) => {

  return (
    <Page>
      <Box h="100%">
        <PageHeader text="Transactions"/>
        <RoutedTabs tabs={ TABS } defaultActiveTab={ tab }/>
      </Box>
    </Page>
  );
};

export default Transactions;
