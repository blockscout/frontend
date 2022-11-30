import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import BlockDetails from 'ui/block/BlockDetails';
import BlockTxs from 'ui/block/BlockTxs';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

const TABS: Array<RoutedTab> = [
  { id: 'index', title: 'Details', component: <BlockDetails/> },
  { id: 'txs', title: 'Transactions', component: <BlockTxs/> },
];

const BlockPageContent = () => {
  const router = useRouter();

  if (!router.query.id) {
    return null;
  }

  return (
    <Page>
      <PageTitle text={ `Block #${ router.query.id }` }/>
      <RoutedTabs tabs={ TABS }/>
    </Page>
  );
};

export default BlockPageContent;
