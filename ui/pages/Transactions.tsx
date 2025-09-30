import { Flex } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import getNetworkValidationActionText from 'lib/networks/getNetworkValidationActionText';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TX } from 'stubs/tx';
import { generateListStub } from 'stubs/utils';
import { Link } from 'toolkit/chakra/link';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import useIsAuth from 'ui/snippets/auth/useIsAuth';
import TxsStats from 'ui/txs/TxsStats';
import TxsWatchlist from 'ui/txs/TxsWatchlist';
import TxsWithFrontendSorting from 'ui/txs/TxsWithFrontendSorting';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 6,
  marginTop: -5,
};
const TABS_HEIGHT = 88;

const Transactions = () => {
  const verifiedTitle = capitalize(getNetworkValidationActionText());
  const router = useRouter();
  const isMobile = useIsMobile();
  const tab = getQueryParamString(router.query.tab);

  const txsValidatedQuery = useQueryWithPages({
    resourceName: 'general:txs_validated',
    filters: { filter: 'validated' },
    options: {
      enabled: !tab || tab === 'validated',
      placeholderData: generateListStub<'general:txs_validated'>(TX, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
        filter: 'validated',
      } }),
    },
  });

  const txsPendingQuery = useQueryWithPages({
    resourceName: 'general:txs_pending',
    filters: { filter: 'pending' },
    options: {
      enabled: tab === 'pending',
      placeholderData: generateListStub<'general:txs_pending'>(TX, 50, { next_page_params: {
        inserted_at: '2024-02-05T07:04:47.749818Z',
        hash: '0x00',
        filter: 'pending',
      } }),
    },
  });

  const txsWithBlobsQuery = useQueryWithPages({
    resourceName: 'general:txs_with_blobs',
    filters: { type: 'blob_transaction' },
    options: {
      enabled: config.features.dataAvailability.isEnabled && tab === 'blob_txs',
      placeholderData: generateListStub<'general:txs_with_blobs'>(TX, 50, { next_page_params: {
        block_number: 10602877,
        index: 8,
        items_count: 50,
      } }),
    },
  });

  const txsWatchlistQuery = useQueryWithPages({
    resourceName: 'general:txs_watchlist',
    options: {
      enabled: tab === 'watchlist',
      placeholderData: generateListStub<'general:txs_watchlist'>(TX, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
      } }),
    },
  });

  const isAuth = useIsAuth();

  const tabs: Array<TabItemRegular> = [
    {
      id: 'validated',
      title: verifiedTitle,
      component:
        <TxsWithFrontendSorting
          query={ txsValidatedQuery }
          socketType="txs_validated"
          top={ TABS_HEIGHT }
        /> },
    {
      id: 'pending',
      title: 'Pending',
      component: (
        <TxsWithFrontendSorting
          query={ txsPendingQuery }
          showBlockInfo={ false }
          socketType="txs_pending"
          top={ TABS_HEIGHT }
        />
      ),
    },
    config.features.dataAvailability.isEnabled && {
      id: 'blob_txs',
      title: 'Blob txns',
      component: (
        <TxsWithFrontendSorting
          query={ txsWithBlobsQuery }
          top={ TABS_HEIGHT }
        />
      ),
    },
    isAuth ? {
      id: 'watchlist',
      title: 'Watch list',
      component: <TxsWatchlist query={ txsWatchlistQuery }/>,
    } : undefined,
  ].filter(Boolean);

  const pagination = (() => {
    switch (tab) {
      case 'pending': return txsPendingQuery.pagination;
      case 'watchlist': return txsWatchlistQuery.pagination;
      case 'blob_txs': return txsWithBlobsQuery.pagination;
      default: return txsValidatedQuery.pagination;
    }
  })();

  const rightSlot = (() => {
    if (isMobile) {
      return null;
    }

    const isAdvancedFilterEnabled = config.features.advancedFilter.isEnabled;

    if (!isAdvancedFilterEnabled && !pagination.isVisible) {
      return null;
    }

    return (
      <Flex alignItems="center" gap={ 6 }>
        { isAdvancedFilterEnabled && (
          <Link
            href={ route({ pathname: '/advanced-filter' }) }
            alignItems="center"
            display="flex"
            gap={ 1 }
          >
            <IconSvg name="filter" boxSize={ 5 }/>
            Advanced filter
          </Link>
        ) }
        { pagination.isVisible && <Pagination my={ 1 } { ...pagination }/> }
      </Flex>
    );
  })();

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } transactions` : 'Transactions' }
        withTextAd
      />
      <TxsStats/>
      <RoutedTabs
        tabs={ tabs }
        listProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ rightSlot }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default Transactions;
