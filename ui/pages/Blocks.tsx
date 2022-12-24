import { useRouter } from 'next/router';
import React from 'react';

import type { BlockType } from 'types/api/block';
import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import BlocksContent from 'ui/blocks/BlocksContent';
import BlocksTabSlot from 'ui/blocks/BlocksTabSlot';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

const TAB_TO_TYPE: Record<string, BlockType> = {
  blocks: 'block',
  reorgs: 'reorg',
  uncles: 'uncle',
};

const TAB_LIST_PROPS = {
  marginBottom: 0,
  py: 5,
  marginTop: -5,
};

const BlocksPageContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const type = router.query.tab && !Array.isArray(router.query.tab) ? TAB_TO_TYPE[router.query.tab] : 'block';

  const blocksQuery = useQueryWithPages({
    resourceName: 'blocks',
    filters: { type },
  });

  const tabs: Array<RoutedTab> = [
    { id: 'blocks', title: 'All', component: <BlocksContent type="block" query={ blocksQuery }/> },
    { id: 'reorgs', title: 'Forked', component: <BlocksContent type="reorg" query={ blocksQuery }/> },
    { id: 'uncles', title: 'Uncles', component: <BlocksContent type="uncle" query={ blocksQuery }/> },
  ];

  return (
    <Page>
      <PageTitle text="Blocks"/>
      <RoutedTabs
        tabs={ tabs }
        tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ <BlocksTabSlot pagination={ blocksQuery.pagination } isPaginationVisible={ blocksQuery.isPaginationVisible }/> }
        stickyEnabled={ !isMobile }
      />
    </Page>
  );
};

export default BlocksPageContent;
