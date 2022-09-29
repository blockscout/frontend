import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import BlockDetails from 'ui/block/BlockDetails';
import BlockTxs from 'ui/block/BlockTxs';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

const TABS: Array<RoutedTab> = [
  { routeName: 'block_index', title: 'Details', component: <BlockDetails/> },
  { routeName: 'block_txs', title: 'Transactions', component: <BlockTxs/> },
];

export interface Props {
  tab: RoutedTab['routeName'];
}

const BlockPageContent = ({ tab }: Props) => {
  const router = useRouter();

  return (
    <Page>
      <PageTitle text={ `Block #${ router.query.id || '' }` }/>
      <RoutedTabs
        tabs={ TABS }
        defaultActiveTab={ tab }
      />
    </Page>
  );
};

export default BlockPageContent;
