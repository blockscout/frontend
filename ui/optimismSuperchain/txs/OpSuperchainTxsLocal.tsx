import { Box, Flex } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import { route } from 'nextjs/routes';

import getSocketUrl from 'lib/api/getSocketUrl';
import { useMultichainContext } from 'lib/contexts/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import getNetworkValidationActionText from 'lib/networks/getNetworkValidationActionText';
import getQueryParamString from 'lib/router/getQueryParamString';
import { SocketProvider } from 'lib/socket/context';
import { TX } from 'stubs/tx';
import { generateListStub } from 'stubs/utils';
import { Link } from 'toolkit/chakra/link';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import IconSvg from 'ui/shared/IconSvg';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TxsStats from 'ui/txs/TxsStats';
import TxsWithFrontendSorting from 'ui/txs/TxsWithFrontendSorting';

export const OP_SUPERCHAIN_TXS_LOCAL_TAB_IDS = [ 'local_txs_validated', 'local_txs_pending', 'local_txs_blob' ];
const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: { base: 9, lg: 3 },
};
const QUERY_PRESERVED_PARAMS = [ 'chain-slug' ];

const OpSuperchainTxsLocal = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);
  const multichainContext = useMultichainContext();

  const chainConfig = multichainContext?.chain.config;

  const txsValidatedQuery = useQueryWithPages({
    resourceName: 'general:txs_validated',
    filters: { filter: 'validated' },
    options: {
      enabled: tab === 'local_txs_validated' || tab === 'local_txs',
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
      enabled: tab === 'local_txs_pending',
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
      enabled: chainConfig?.features.dataAvailability.isEnabled && tab === 'local_txs_blob',
      placeholderData: generateListStub<'general:txs_with_blobs'>(TX, 50, { next_page_params: {
        block_number: 10602877,
        index: 8,
        items_count: 50,
      } }),
    },
  });

  const verifiedTitle = capitalize(getNetworkValidationActionText(chainConfig));

  const tabs: Array<TabItemRegular> = [
    {
      id: 'local_txs_validated',
      title: verifiedTitle,
      component:
        <TxsWithFrontendSorting
          query={ txsValidatedQuery }
          socketType="txs_validated"
          top={ ACTION_BAR_HEIGHT_DESKTOP }
        /> },
    {
      id: 'local_txs_pending',
      title: 'Pending',
      component: (
        <TxsWithFrontendSorting
          query={ txsPendingQuery }
          showBlockInfo={ false }
          socketType="txs_pending"
          top={ ACTION_BAR_HEIGHT_DESKTOP }
        />
      ),
    },
    chainConfig?.features.dataAvailability.isEnabled && {
      id: 'local_txs_blob',
      title: 'Blob txns',
      component: (
        <TxsWithFrontendSorting
          query={ txsWithBlobsQuery }
          top={ ACTION_BAR_HEIGHT_DESKTOP }
        />
      ),
    },
  ].filter(Boolean);

  const currentQuery = (() => {
    switch (tab) {
      case 'local_txs_pending': return txsPendingQuery;
      case 'local_txs_blob': return txsWithBlobsQuery;
      default: return txsValidatedQuery;
    }
  })();

  const rightSlot = (() => {
    if (isMobile) {
      return null;
    }

    const isAdvancedFilterEnabled = chainConfig?.features.advancedFilter.isEnabled;

    if (!isAdvancedFilterEnabled && !currentQuery.pagination.isVisible) {
      return null;
    }

    return (
      <Flex alignItems="center" gap={ 6 }>
        { isAdvancedFilterEnabled && (
          <Link
            href={ route({ pathname: '/advanced-filter' }, multichainContext) }
            alignItems="center"
            display="flex"
            gap={ 1 }
            textStyle="sm"
          >
            <IconSvg name="filter" boxSize={ 5 }/>
            Advanced filter
          </Link>
        ) }
        { currentQuery.pagination.isVisible && <Pagination { ...currentQuery.pagination }/> }
      </Flex>
    );
  })();

  return (
    <Box>
      <TxsStats mt={ 3 } mb={ 0 }/>
      <SocketProvider url={ getSocketUrl(chainConfig) }>
        <RoutedTabs
          tabs={ tabs }
          isLoading={ currentQuery.isPlaceholderData }
          variant="secondary"
          size="sm"
          preservedParams={ QUERY_PRESERVED_PARAMS }
          stickyEnabled={ !isMobile }
          listProps={ TAB_LIST_PROPS }
          rightSlot={ rightSlot }
        />
      </SocketProvider>
    </Box>
  );
};

export default React.memo(OpSuperchainTxsLocal);
