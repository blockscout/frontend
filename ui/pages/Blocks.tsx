import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { BLOCK } from 'stubs/block';
import { generateListStub } from 'stubs/utils';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import BlocksContent from 'ui/blocks/BlocksContent';
import BlocksTabSlot from 'ui/blocks/BlocksTabSlot';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 6,
  marginTop: -5,
};

const BlocksPageContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const tab = getQueryParamString(router.query.tab);

  const blocksQuery = useQueryWithPages({
    resourceName: 'general:blocks',
    filters: { type: 'block' },
    options: {
      enabled: tab === 'blocks' || !tab,
      placeholderData: generateListStub<'general:blocks'>(BLOCK, 50, { next_page_params: {
        block_number: 8988686,
        items_count: 50,
      } }),
    },
  });
  const reorgsQuery = useQueryWithPages({
    resourceName: 'general:blocks',
    filters: { type: 'reorg' },
    options: {
      enabled: tab === 'reorgs',
      placeholderData: generateListStub<'general:blocks'>(BLOCK, 50, { next_page_params: {
        block_number: 8988686,
        items_count: 50,
      } }),
    },
  });
  const unclesQuery = useQueryWithPages({
    resourceName: 'general:blocks',
    filters: { type: 'uncle' },
    options: {
      enabled: tab === 'uncles',
      placeholderData: generateListStub<'general:blocks'>(BLOCK, 50, { next_page_params: {
        block_number: 8988686,
        items_count: 50,
      } }),
    },
  });

  const pagination = (() => {
    if (tab === 'reorgs') {
      return reorgsQuery.pagination;
    }
    if (tab === 'uncles') {
      return unclesQuery.pagination;
    }
    return blocksQuery.pagination;
  })();

  const tabs: Array<TabItemRegular> = [
    { id: 'blocks', title: 'All', component: <BlocksContent type="block" query={ blocksQuery }/> },
    { id: 'reorgs', title: 'Forked', component: <BlocksContent type="reorg" query={ reorgsQuery }/> },
    { id: 'uncles', title: 'Uncles', component: <BlocksContent type="uncle" query={ unclesQuery }/> },
  ];

  return (
    <>
      <PageTitle title="Blocks" withTextAd/>
      <RoutedTabs
        tabs={ tabs }
        listProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ <BlocksTabSlot pagination={ pagination }/> }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default BlocksPageContent;
