import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import BlocksContent from 'ui/blocks/BlocksContent';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

const TABS: Array<RoutedTab> = [
  { id: 'blocks', title: 'All', component: <BlocksContent/> },
  { id: 'reorgs', title: 'Forked', component: <BlocksContent type="reorg"/> },
  { id: 'uncles', title: 'Uncles', component: <BlocksContent type="uncle"/> },
];

const BlocksPageContent = () => {
  return (
    <Page>
      <PageTitle text="Blocks"/>
      <RoutedTabs
        tabs={ TABS }
      />
    </Page>
  );
};

export default BlocksPageContent;
