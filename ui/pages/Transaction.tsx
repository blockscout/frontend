import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import Page from 'ui/shared/Page';
import PageHeader from 'ui/shared/PageHeader';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
import TxDetails from 'ui/tx/TxDetails';
import TxInternals from 'ui/tx/TxInternals';
import TxLogs from 'ui/tx/TxLogs';
import TxRawTrace from 'ui/tx/TxRawTrace';
import TxState from 'ui/tx/TxState';

const TABS: Array<RoutedTab> = [
  { routeName: 'tx_index', title: 'Details', component: <TxDetails/> },
  { routeName: 'tx_internal', title: 'Internal txn', component: <TxInternals/> },
  { routeName: 'tx_logs', title: 'Logs', component: <TxLogs/> },
  { routeName: 'tx_state', title: 'State', component: <TxState/> },
  { routeName: 'tx_raw_trace', title: 'Raw trace', component: <TxRawTrace/> },
];

export interface Props {
  tab: RoutedTab['routeName'];
}

const TransactionPageContent = ({ tab }: Props) => {
  return (
    <Page>
      <PageHeader text="Transaction details"/>
      <RoutedTabs tabs={ TABS } defaultActiveTab={ tab }/>
    </Page>
  );
};

export default TransactionPageContent;
