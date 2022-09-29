import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import BlocksContent from 'ui/blocks/BlocksContent';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

const TABS: Array<RoutedTab> = [
  { routeName: 'blocks', title: 'All', component: <BlocksContent/> },
  { routeName: 'blocks_reorgs', title: 'Forked', component: <BlocksContent/> },
  { routeName: 'blocks_uncles', title: 'Uncles', component: <BlocksContent/> },
];

export interface Props {
  tab: RoutedTab['routeName'];
}

const BlocksPageContent = ({ tab }: Props) => {
  return (
    <Page>
      <PageTitle text="Blocks"/>
      <RoutedTabs
        tabs={ TABS }
        defaultActiveTab={ tab }
      />
    </Page>
  );
};

export default BlocksPageContent;
