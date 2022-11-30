import { useRouter } from 'next/router';
import React from 'react';

import type { BlockType } from 'types/api/block';
import { QueryKeys } from 'types/client/queries';
import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

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

const BlocksPageContent = () => {
  const router = useRouter();
  const type = router.query.tab && !Array.isArray(router.query.tab) ? TAB_TO_TYPE[router.query.tab] : undefined;
  const blocksQuery = useQueryWithPages({
    apiPath: '/node-api/blocks',
    queryName: QueryKeys.blocks,
    filters: { type },
  });

  const tabs: Array<RoutedTab> = [
    { id: 'blocks', title: 'All', component: <BlocksContent query={ blocksQuery }/> },
    { id: 'reorgs', title: 'Forked', component: <BlocksContent type="reorg" query={ blocksQuery }/> },
    { id: 'uncles', title: 'Uncles', component: <BlocksContent type="uncle" query={ blocksQuery }/> },
  ];

  return (
    <Page>
      <PageTitle text="Blocks"/>
      <RoutedTabs
        tabs={ tabs }
        tabListMarginBottom={{ base: 6, lg: 8 }}
        rightSlot={ <BlocksTabSlot pagination={ blocksQuery.pagination }/> }
      />
    </Page>
  );
};

export default BlocksPageContent;
