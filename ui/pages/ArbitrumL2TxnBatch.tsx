import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ARBITRUM_L2_TXN_BATCH } from 'stubs/arbitrumL2';
import { BLOCK } from 'stubs/block';
import { TX } from 'stubs/tx';
import { generateListStub } from 'stubs/utils';
import BlocksContent from 'ui/blocks/BlocksContent';
import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import ArbitrumL2TxnBatchDetails from 'ui/txnBatches/arbitrumL2/ArbitrumL2TxnBatchDetails';
import TxsWithFrontendSorting from 'ui/txs/TxsWithFrontendSorting';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  py: 5,
  marginTop: -5,
};

const TABS_HEIGHT = 80;

const ArbitrumL2TxnBatch = () => {
  const router = useRouter();
  const appProps = useAppContext();
  const number = getQueryParamString(router.query.number);
  const tab = getQueryParamString(router.query.tab);
  const isMobile = useIsMobile();

  const batchQuery = useApiQuery('arbitrum_l2_txn_batch', {
    pathParams: { number },
    queryOptions: {
      enabled: Boolean(number),
      placeholderData: ARBITRUM_L2_TXN_BATCH,
    },
  });

  const batchTxsQuery = useQueryWithPages({
    resourceName: 'arbitrum_l2_txn_batch_txs',
    pathParams: { number },
    options: {
      enabled: Boolean(!batchQuery.isPlaceholderData && batchQuery.data?.number && tab === 'txs'),
      placeholderData: generateListStub<'arbitrum_l2_txn_batch_txs'>(TX, 50, { next_page_params: {
        batch_number: '8122',
        block_number: 1338932,
        index: 0,
        items_count: 50,
      } }),
    },
  });

  const batchBlocksQuery = useQueryWithPages({
    resourceName: 'arbitrum_l2_txn_batch_blocks',
    pathParams: { number },
    options: {
      enabled: Boolean(!batchQuery.isPlaceholderData && batchQuery.data?.number && tab === 'blocks'),
      placeholderData: generateListStub<'arbitrum_l2_txn_batch_blocks'>(BLOCK, 50, { next_page_params: {
        batch_number: '8122',
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

  const tabs: Array<RoutedTab> = React.useMemo(() => ([
    { id: 'index', title: 'Details', component: <ArbitrumL2TxnBatchDetails query={ batchQuery }/> },
    {
      id: 'txs',
      title: 'Transactions',
      component: <TxsWithFrontendSorting query={ batchTxsQuery } showSocketInfo={ false } top={ hasPagination ? TABS_HEIGHT : 0 }/>,
    },
    {
      id: 'blocks',
      title: 'Blocks',
      component: <BlocksContent type="block" query={ batchBlocksQuery } enableSocket={ false } top={ hasPagination ? TABS_HEIGHT : 0 }/>,
    },
  ].filter(Boolean)), [ batchQuery, batchTxsQuery, batchBlocksQuery, hasPagination ]);

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.endsWith('/batches');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to tx batches list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `Tx batch #${ number }` }
        backLink={ backLink }
      />
      { batchQuery.isPlaceholderData ?
        <TabsSkeleton tabs={ tabs }/> : (
          <RoutedTabs
            tabs={ tabs }
            tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
            rightSlot={ hasPagination && pagination ? <Pagination { ...(pagination) }/> : null }
            stickyEnabled={ hasPagination }
          />
        ) }
    </>
  );
};

export default ArbitrumL2TxnBatch;
