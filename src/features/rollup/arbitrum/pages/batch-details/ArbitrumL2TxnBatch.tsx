// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import PageTitle from 'src/shell/page/title/PageTitle';

import BlocksContent from 'src/slices/block/pages/index/BlocksContent';
import { BLOCK_ITEM } from 'src/slices/block/stubs/list';
import TxsWithFrontendSorting from 'src/slices/tx/pages/index/list/TxsWithFrontendSorting';
import { TX_ITEM } from 'src/slices/tx/stubs/tx';

import TextAd from 'src/features/ads/text/components/TextAd';

import throwOnAbsentParamError from 'src/shared/errors/throw-on-absent-param-error';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

import ArbitrumL2TxnBatchDetails from './ArbitrumL2TxnBatchDetails';
import useBatchQuery from './useBatchQuery';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  py: 5,
  marginTop: -5,
};

const TABS_HEIGHT = 80;

const ArbitrumL2TxnBatch = () => {
  const router = useRouter();
  const number = getQueryParamString(router.query.number);
  const height = getQueryParamString(router.query.height);
  const commitment = getQueryParamString(router.query.commitment);
  const tab = getQueryParamString(router.query.tab);
  const isMobile = useIsMobile();

  const batchQuery = useBatchQuery();

  const batchTxsQuery = useQueryWithPages({
    resourceName: 'core:arbitrum_l2_txn_batch_txs',
    pathParams: { number: String(batchQuery.data?.number) },
    options: {
      enabled: Boolean(!batchQuery.isPlaceholderData && batchQuery.data?.number && tab === 'txs'),
      placeholderData: generateListStub<'core:arbitrum_l2_txn_batch_txs'>(TX_ITEM, 50, { next_page_params: {
        batch_number: '8122',
        block_number: 1338932,
        index: 0,
        items_count: 50,
      } }),
    },
  });

  const batchBlocksQuery = useQueryWithPages({
    resourceName: 'core:arbitrum_l2_txn_batch_blocks',
    pathParams: { number: String(batchQuery.data?.number) },
    options: {
      enabled: Boolean(!batchQuery.isPlaceholderData && batchQuery.data?.number && tab === 'blocks'),
      placeholderData: generateListStub<'core:arbitrum_l2_txn_batch_blocks'>(BLOCK_ITEM, 50, { next_page_params: {
        batch_number: '8122',
        block_number: 1338932,
        items_count: 50,
      } }),
    },
  });

  throwOnAbsentParamError(number || (height && commitment));
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
    { id: 'index', title: 'Details', component: <ArbitrumL2TxnBatchDetails query={ batchQuery }/> },
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
        title={ `Txn batch #${ batchQuery.data?.number }` }
        isLoading={ batchQuery.isPlaceholderData }
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

export default ArbitrumL2TxnBatch;
