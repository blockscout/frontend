import { Flex, Link, Icon } from '@chakra-ui/react';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import eastArrowIcon from 'icons/arrows/east.svg';
import useLink from 'lib/link/useLink';
import ExternalLink from 'ui/shared/ExternalLink';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
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

  return (
    <Page>
      { /* TODO should be shown only when navigating from txs list */ }
      <Link mb={ 6 } display="inline-flex" href={ link('txs_validated') }>
        <Icon as={ eastArrowIcon } boxSize={ 6 } mr={ 2 } transform="rotate(180deg)"/>
        Transactions
      </Link>
      <Flex alignItems="flex-start" flexDir={{ base: 'column', lg: 'row' }}>
        <PageTitle text="Transaction details"/>
        <Flex
          alignItems="center"
          flexWrap="wrap"
          columnGap={ 6 }
          rowGap={ 3 }
          ml={{ base: 'initial', lg: 'auto' }}
          mb={{ base: 6, lg: 'initial' }}
          py={ 2.5 }
        >
          <ExternalLink title="Open in Tenderly" href="#"/>
          <ExternalLink title="Open in Blockchair" href="#"/>
          <ExternalLink title="Open in Etherscan" href="#"/>
        </Flex>
      </Flex>
      <RoutedTabs
        tabs={ TABS }
        defaultActiveTab={ tab }
      />
    </Page>
  );
};

export default TransactionPageContent;
