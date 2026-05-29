// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import { SocketProvider } from 'src/api/socket/context';

import ActionBar from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import TxsWithFrontendSorting from 'src/slices/tx/pages/index/list/TxsWithFrontendSorting';
import TxsStats from 'src/slices/tx/pages/index/stats/TxsStats';
import { TX } from 'src/slices/tx/stubs/tx';

import useIsAuth from 'src/features/account/hooks/useIsAuth';
import TxsWatchlist from 'src/features/account/pages/tx-index-watchlist/TxsWatchlist';
import AdvancedFilterLink from 'src/features/advanced-filter/components/AdvancedFilterLink';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

import ZetaChainCCTXsTab from './ZetaChainCCTXsTab';
import ZetaChainEvmTransactions from './ZetaChainEvmTransactions';

const ZETACHAIN_TABS = [ 'zetachain_validated', 'zetachain_pending' ];
const CROSS_CHAIN_TABS = [ 'cctx_pending', 'cctx_mined' ];

const TransactionsZetaChain = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const tab = getQueryParamString(router.query.tab);

  const txsWithBlobsQuery = useQueryWithPages({
    resourceName: 'core:txs_with_blobs',
    filters: { type: 'blob_transaction' },
    options: {
      enabled: config.features.dataAvailability.isEnabled && tab === 'blob_txs',
      placeholderData: generateListStub<'core:txs_with_blobs'>(TX, 50, { next_page_params: {
        block_number: 10602877,
        index: 8,
        items_count: 50,
      } }),
    },
  });

  const txsWatchlistQuery = useQueryWithPages({
    resourceName: 'core:txs_watchlist',
    options: {
      enabled: tab === 'watchlist',
      placeholderData: generateListStub<'core:txs_watchlist'>(TX, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
      } }),
    },
  });

  const isAuth = useIsAuth();

  // for cctxs and evm txs we show pagination with the secondary tabs
  const pagination = (() => {
    switch (tab) {
      case 'watchlist': return txsWatchlistQuery.pagination;
      case 'blob_txs': return txsWithBlobsQuery.pagination;
      default: return null;
    }
  })();

  const topRow = (() => {
    if (isMobile) {
      return null;
    }

    if (tab !== 'blob_txs' && tab !== 'watchlist') {
      return null;
    }

    const isAdvancedFilterEnabled = config.features.advancedFilter.isEnabled;

    if (!isAdvancedFilterEnabled && !pagination?.isVisible) {
      return null;
    }

    return (
      <ActionBar
        mt={ -6 }
        display={{ base: pagination?.isVisible ? 'flex' : 'none', lg: 'flex' }}
        justifyContent="end"
        gap={ 6 }
      >
        { isAdvancedFilterEnabled && <AdvancedFilterLink/> }
        { pagination?.isVisible && <Pagination { ...pagination }/> }
      </ActionBar>
    );
  })();

  const tabs: Array<TabItemRegular> = [
    {
      id: 'cctx',
      title: 'Cross chain',
      component: (
        <SocketProvider url={ config.apis.zetachain?.socketEndpoint } name="zetachain">
          <ZetaChainCCTXsTab/>
        </SocketProvider>
      ),
      subTabs: CROSS_CHAIN_TABS,
    },
    {
      id: 'zetachain',
      title: 'ZetaChain EVM',
      component: <ZetaChainEvmTransactions/>,
      subTabs: ZETACHAIN_TABS,
    },
    config.features.dataAvailability.isEnabled && {
      id: 'blob_txs',
      title: 'Blob txns',
      component: (
        <>
          <TxsStats/>
          { topRow }
          <TxsWithFrontendSorting query={ txsWithBlobsQuery }/>
        </>
      ),
    },
    isAuth ? {
      id: 'watchlist',
      title: 'Watch list',
      component: (
        <>
          <TxsStats/>
          { topRow }
          <TxsWatchlist query={ txsWatchlistQuery }/>
        </>
      ),
    } : undefined,
  ].filter(Boolean);

  return (
    <>
      <PageTitle
        title={ config.metadata.seo.enhancedDataEnabled ? `${ config.chain.name } transactions` : 'Transactions' }
        withTextAd
      />
      <RoutedTabs tabs={ tabs } defaultTabId="zetachain"/>
    </>
  );
};

export default TransactionsZetaChain;
