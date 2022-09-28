import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import Page from 'ui/shared/Page';
import PageHeader from 'ui/shared/PageHeader';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

const TABS: Array<RoutedTab> = [
  { routeName: 'blocks', title: 'All', component: <div>All</div> },
  { routeName: 'reorgs', title: 'Forked', component: <div>Forked</div> },
  { routeName: 'uncles', title: 'Uncles', component: <div>Uncles</div> },
];

export interface Props {
  tab: RoutedTab['routeName'];
}

const BlocksPageContent = ({ tab }: Props) => {
  const router = useRouter();

  return (
    <Page>
      <PageHeader text={ `Block #${ router.query.id || '' }` }/>
      <RoutedTabs
        tabs={ TABS }
        defaultActiveTab={ tab }
      />
    </Page>
  );
};

export default BlocksPageContent;
