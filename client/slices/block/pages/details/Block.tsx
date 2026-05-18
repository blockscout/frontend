// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';
import type { PaginationParams } from 'ui/shared/pagination/types';

import { routeParams } from 'nextjs/routes';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import BlockPendingUpdateAlert from 'client/slices/block/components/BlockPendingUpdateAlert';
import * as BlockEntity from 'client/slices/block/components/entity/BlockEntity';
import useBlockInternalTxsQuery from 'client/slices/block/hooks/useBlockInternalTxsQuery';
import useBlockQuery from 'client/slices/block/hooks/useBlockQuery';
import useBlockTxsQuery from 'client/slices/block/hooks/useBlockTxsQuery';
import BlockDetails from 'client/slices/block/pages/details/BlockDetails';
import BlockInternalTxs from 'client/slices/block/pages/details/BlockInternalTxs';
import TxsWithFrontendSorting from 'client/slices/tx/pages/index/list/TxsWithFrontendSorting';

import BlockDeposits from 'client/features/chain-variants/beacon-chain/pages/block/BlockDeposits';
import BlockWithdrawals from 'client/features/chain-variants/beacon-chain/pages/block/BlockWithdrawals';
import useBlockDepositsQuery from 'client/features/chain-variants/beacon-chain/pages/block/useBlockDepositsQuery';
import useBlockWithdrawalsQuery from 'client/features/chain-variants/beacon-chain/pages/block/useBlockWithdrawalsQuery';
import BlockCeloEpochTag from 'client/features/chain-variants/celo/pages/block/BlockCeloEpochTag';
import useBlockBlobTxsQuery from 'client/features/data-availability/hooks/useBlockBlobTxsQuery';

import getChainValidatorTitle from 'client/shared/chain/get-chain-validator-title';
import throwOnAbsentParamError from 'client/shared/errors/throw-on-absent-param-error';
import throwOnResourceLoadError from 'client/shared/errors/throw-on-resource-load-error';
import useIsMobile from 'client/shared/hooks/useIsMobile';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import { Skeleton } from 'toolkit/chakra/skeleton';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import TextAd from 'ui/shared/ad/TextAd';
import ServiceDegradationWarning from 'ui/shared/alerts/ServiceDegradationWarning';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 6,
  marginTop: -5,
};
const TABS_HEIGHT = 88;

const BlockPageContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const heightOrHash = getQueryParamString(router.query.height_or_hash);
  const tab = getQueryParamString(router.query.tab);
  const multichainContext = useMultichainContext();

  const chainConfig = multichainContext?.chain.app_config ?? config;
  const beaconChainFeature = chainConfig.features.beaconChain;

  const blockQuery = useBlockQuery({ heightOrHash });
  const blockTxsQuery = useBlockTxsQuery({ heightOrHash, blockQuery, tab });
  const blockWithdrawalsQuery = useBlockWithdrawalsQuery({ heightOrHash, blockQuery, tab });
  const blockDepositsQuery = useBlockDepositsQuery({ heightOrHash, blockQuery, tab });
  const blockBlobTxsQuery = useBlockBlobTxsQuery({ heightOrHash, blockQuery, tab });
  const blockInternalTxsQuery = useBlockInternalTxsQuery({ heightOrHash, blockQuery, tab, chainConfig });

  const hasPagination = !isMobile && (
    (tab === 'txs' && blockTxsQuery.pagination.isVisible) ||
    (tab === 'withdrawals' && blockWithdrawalsQuery.pagination.isVisible) ||
    (tab === 'deposits' && blockDepositsQuery.pagination.isVisible) ||
    (tab === 'internal_txs' && blockInternalTxsQuery.pagination.isVisible)
  );

  const tabs: Array<TabItemRegular> = React.useMemo(() => ([
    {
      id: 'index',
      title: 'Details',
      component: (
        <>
          <Flex rowGap={{ base: 1, lg: 2 }} mb={{ base: 3, lg: 6 }} flexDir="column">
            { blockQuery.isDegradedData && <ServiceDegradationWarning isLoading={ blockQuery.isPlaceholderData }/> }
            { blockQuery.data?.is_pending_update && <BlockPendingUpdateAlert/> }
          </Flex>
          <BlockDetails query={ blockQuery }/>
        </>
      ),
    },
    {
      id: 'txs',
      title: 'Transactions',
      component: (
        <>
          { blockTxsQuery.isDegradedData && <ServiceDegradationWarning isLoading={ blockTxsQuery.isPlaceholderData } mb={{ base: 3, lg: 6 }}/> }
          <TxsWithFrontendSorting query={ blockTxsQuery } showBlockInfo={ false } top={ hasPagination ? TABS_HEIGHT : 0 }/>
        </>
      ),
    },
    chainConfig.UI.views.internalTx.isEnabled ? {
      id: 'internal_txs',
      title: 'Internal txns',
      component: (
        <>
          { blockTxsQuery.isDegradedData && <ServiceDegradationWarning isLoading={ blockTxsQuery.isPlaceholderData } mb={{ base: 3, lg: 6 }}/> }
          <BlockInternalTxs query={ blockInternalTxsQuery } top={ hasPagination ? TABS_HEIGHT : 0 }/>
        </>
      ),
    } : null,
    chainConfig.features.dataAvailability.isEnabled && blockQuery.data?.blob_transactions_count ?
      {
        id: 'blob_txs',
        title: 'Blob txns',
        component: (
          <TxsWithFrontendSorting query={ blockBlobTxsQuery } showBlockInfo={ false }/>
        ),
      } : null,
    beaconChainFeature.isEnabled && !beaconChainFeature.withdrawalsOnly && Boolean(blockQuery.data?.beacon_deposits_count) ?
      {
        id: 'deposits',
        title: 'Deposits',
        component: (
          <>
            { blockDepositsQuery.isDegradedData && <ServiceDegradationWarning isLoading={ blockDepositsQuery.isPlaceholderData } mb={{ base: 3, lg: 6 }}/> }
            <BlockDeposits blockDepositsQuery={ blockDepositsQuery }/>
          </>
        ),
      } : null,
    beaconChainFeature.isEnabled && Boolean(blockQuery.data?.withdrawals_count) ?
      {
        id: 'withdrawals',
        title: 'Withdrawals',
        component: (
          <>
            { blockWithdrawalsQuery.isDegradedData &&
              <ServiceDegradationWarning isLoading={ blockWithdrawalsQuery.isPlaceholderData } mb={{ base: 3, lg: 6 }}/> }
            <BlockWithdrawals blockWithdrawalsQuery={ blockWithdrawalsQuery }/>
          </>
        ),
      } : null,
  ].filter(Boolean)), [
    beaconChainFeature,
    blockBlobTxsQuery,
    blockDepositsQuery,
    blockInternalTxsQuery,
    blockQuery,
    blockTxsQuery,
    blockWithdrawalsQuery,
    chainConfig.UI.views.internalTx.isEnabled,
    chainConfig.features.dataAvailability.isEnabled,
    hasPagination,
  ]);

  let pagination;
  if (tab === 'txs') {
    pagination = blockTxsQuery.pagination;
  } else if (tab === 'withdrawals') {
    pagination = blockWithdrawalsQuery.pagination;
  } else if (tab === 'deposits') {
    pagination = blockDepositsQuery.pagination;
  } else if (tab === 'internal_txs') {
    pagination = blockInternalTxsQuery.pagination;
  }

  throwOnAbsentParamError(heightOrHash);

  if (blockQuery.isError) {
    if (!blockQuery.isDegradedData && blockQuery.error.status === 404 && !heightOrHash.startsWith('0x') && blockQuery.isFutureBlock) {
      const url = routeParams({ pathname: '/block/countdown/[height]', query: { height: heightOrHash } }, multichainContext);
      router.push(url, undefined, { shallow: true });
      return null;
    } else {
      throwOnResourceLoadError(blockQuery);
    }
  }

  const title = (() => {
    switch (blockQuery.data?.type) {
      case 'reorg':
        return `Reorged block #${ blockQuery.data?.height }`;

      case 'uncle':
        return `Uncle block #${ blockQuery.data?.height }`;

      default:
        return `Block #${ blockQuery.data?.height }`;
    }
  })();

  const beforeTitleElement = multichainContext?.chain ? (
    <BlockEntity.Icon variant="heading" chain={ multichainContext.chain } isLoading={ blockQuery.isPlaceholderData }/>
  ) : null;

  const titleSecondRow = (
    <>
      { !chainConfig.UI.views.block.hiddenFields?.miner && blockQuery.data?.miner && (
        <Skeleton
          loading={ blockQuery.isPlaceholderData }
          fontFamily="heading"
          display="flex"
          minW={ 0 }
          columnGap={ 2 }
          fontWeight={ 500 }
        >
          <chakra.span flexShrink={ 0 }>
            { capitalize(getChainValidatorTitle()) }
          </chakra.span>
          <AddressEntity address={ blockQuery.data.miner }/>
        </Skeleton>
      ) }
      <NetworkExplorers
        type="block"
        pathParam={ heightOrHash }
        ml={{ base: chainConfig.UI.views.block.hiddenFields?.miner ? 0 : 3, lg: 'auto' }}
      />
    </>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ title }
        beforeTitle={ beforeTitleElement }
        contentAfter={ <BlockCeloEpochTag blockQuery={ blockQuery }/> }
        secondRow={ titleSecondRow }
        isLoading={ blockQuery.isPlaceholderData }
      />
      <RoutedTabs
        tabs={ tabs }
        isLoading={ blockQuery.isPlaceholderData }
        listProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ hasPagination ? <Pagination { ...(pagination as PaginationParams) }/> : null }
        stickyEnabled={ hasPagination }
      />
    </>
  );
};

export default BlockPageContent;
