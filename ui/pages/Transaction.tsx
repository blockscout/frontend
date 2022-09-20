import { Flex, Link, Icon } from '@chakra-ui/react';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import leftArrowIcon from 'icons/arrows/left.svg';
import externalLinkIcon from 'icons/external-link.svg';
import useLink from 'lib/link/useLink';
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
  const link = useLink();

  const externalLinks = (
    <Flex marginLeft="auto" alignItems="center" columnGap={ 6 }>
      <Link fontSize="sm" display="inline-flex" alignItems="center" target="_blank">
        Open in Tenderly
        <Icon as={ externalLinkIcon }/>
      </Link>
      <Link fontSize="sm" display="inline-flex" alignItems="center" target="_blank">
        Open in Tenderly
        <Icon as={ externalLinkIcon }/>
      </Link>
    </Flex>
  );

  return (
    <Page>
      <Link mb={ 6 } display="inline-flex" href={ link('txs') }>
        <Icon as={ leftArrowIcon } boxSize={ 6 } mr={ 2 }/>
        Transactions
      </Link>
      <PageHeader text="Transaction details"/>
      <RoutedTabs
        tabs={ TABS }
        defaultActiveTab={ tab }
        rightSlot={ externalLinks }
      />
    </Page>
  );
};

export default TransactionPageContent;
