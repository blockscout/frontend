import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import { useFetchEpochsInfo } from 'lib/getEpochList';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { BLOCK } from 'stubs/block';
import { generateListStub } from 'stubs/utils';
import EpochContent from 'ui/epochs/EpochContent';
import EpochTabSlot from 'ui/epochs/EpochTabSlot';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';

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
    resourceName: 'blocks',
    filters: { type: 'block' },
    options: {
      enabled: tab === 'blocks' || !tab,
      placeholderData: generateListStub<'blocks'>(BLOCK, 50, {
        next_page_params: {
          block_number: 8988686,
          items_count: 50,
        },
      }),
    },
  });

  const {
    data: epochList,
    pagination,
    loading,
    totalCount,
  } = useFetchEpochsInfo();

  const tabs: Array<RoutedTab> = [
    {
      id: 'blocks',
      title: 'All',
      component: (
        <EpochContent
          epochList={ epochList }
          loading={ loading }
          pagination={ pagination }
          type="block"
          query={ blocksQuery }
        />
      ),
    },
  ];

  return (
    <>
      <PageTitle title="Epochs" withTextAd/>
      <RoutedTabs
        tabs={ tabs }
        tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={
          <EpochTabSlot pagination={ pagination } totalCount={ totalCount }/>
        }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default BlocksPageContent;
