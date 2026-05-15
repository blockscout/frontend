// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import useApiQuery from 'client/api/hooks/useApiQuery';

import BlocksContent from 'client/slices/block/pages/index/BlocksContent';
import { BLOCK } from 'client/slices/block/stubs/block';
import TxsWithFrontendSorting from 'client/slices/tx/pages/index/list/TxsWithFrontendSorting';
import { TX } from 'client/slices/tx/stubs/tx';

import { SCROLL_L2_TXN_BATCH } from 'client/features/rollup/scroll/stubs';

import throwOnAbsentParamError from 'client/shared/errors/throw-on-absent-param-error';
import throwOnResourceLoadError from 'client/shared/errors/throw-on-resource-load-error';
import useIsMobile from 'client/shared/hooks/useIsMobile';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import { generateListStub } from 'stubs/utils';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import ScrollL2TxnBatchDetails from './ScrollL2TxnBatchDetails';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  py: 5,
  marginTop: -5,
};

const TABS_HEIGHT = 80;

const ScrollL2TxnBatch = () => {
  const router = useRouter();
  const number = getQueryParamString(router.query.number);
  const tab = getQueryParamString(router.query.tab);
  const isMobile = useIsMobile();

  const batchQuery = useApiQuery('general:scroll_l2_txn_batch', {
    pathParams: { number },
    queryOptions: {
      enabled: Boolean(number),
      placeholderData: SCROLL_L2_TXN_BATCH,
    },
  });

  const batchTxsQuery = useQueryWithPages({
    resourceName: 'general:scroll_l2_txn_batch_txs',
    pathParams: { number },
    options: {
      enabled: Boolean(!batchQuery.isPlaceholderData && batchQuery.data?.number && tab === 'txs'),
      placeholderData: generateListStub<'general:scroll_l2_txn_batch_txs'>(TX, 50, { next_page_params: {
        batch_number: 8122,
        block_number: 1338932,
        index: 0,
        items_count: 50,
      } }),
    },
  });

  const batchBlocksQuery = useQueryWithPages({
    resourceName: 'general:scroll_l2_txn_batch_blocks',
    pathParams: { number },
    options: {
      enabled: Boolean(!batchQuery.isPlaceholderData && batchQuery.data?.number && tab === 'blocks'),
      placeholderData: generateListStub<'general:scroll_l2_txn_batch_blocks'>(BLOCK, 50, { next_page_params: {
        batch_number: 8122,
        block_number: 1338932,
        items_count: 50,
      } }),
    },
  });

  throwOnAbsentParamError(number);
  throwOnResourceLoadError(batchQuery);

  let pagination;
  if (tab === 'txs') {
    pagination = batchTxsQuery.pagination;
  }
  if (tab === 'blocks') {
    pagination = batchBlocksQuery.pagination;
  }

  const hasPagination = !isMobile && pagination?.isVisible;

  const tabs: Array<TabItemRegular> = React.useMemo(() => ([
    { id: 'index', title: 'Details', component: <ScrollL2TxnBatchDetails query={ batchQuery }/> },
    {
      id: 'txs',
      title: 'Transactions',
      component: <TxsWithFrontendSorting query={ batchTxsQuery } top={ hasPagination ? TABS_HEIGHT : 0 }/>,
    },
    {
      id: 'blocks',
      title: 'Blocks',
      component: <BlocksContent type="block" query={ batchBlocksQuery } enableSocket={ false } top={ hasPagination ? TABS_HEIGHT : 0 }/>,
    },
  ].filter(Boolean)), [ batchQuery, batchTxsQuery, batchBlocksQuery, hasPagination ]);

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `Txn batch #${ number }` }
      />
      <RoutedTabs
        tabs={ tabs }
        isLoading={ batchQuery.isPlaceholderData }
        listProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ hasPagination && pagination ? <Pagination { ...(pagination) }/> : null }
        stickyEnabled={ hasPagination }
      />
    </>
  );
};

export default ScrollL2TxnBatch;
