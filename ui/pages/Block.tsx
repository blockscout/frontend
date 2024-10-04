import { chakra, Skeleton, Tooltip } from '@chakra-ui/react';
import capitalize from 'lodash/capitalize';
import { useRouter } from 'next/router';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import useIsMobile from 'lib/hooks/useIsMobile';
import getNetworkValidationActionText from 'lib/networks/getNetworkValidationActionText';
import getQueryParamString from 'lib/router/getQueryParamString';
import BlockDetails from 'ui/block/BlockDetails';
import BlockEpochRewards from 'ui/block/BlockEpochRewards';
import BlockWithdrawals from 'ui/block/BlockWithdrawals';
import useBlockBlobTxsQuery from 'ui/block/useBlockBlobTxsQuery';
import useBlockQuery from 'ui/block/useBlockQuery';
import useBlockTxsQuery from 'ui/block/useBlockTxsQuery';
import useBlockWithdrawalsQuery from 'ui/block/useBlockWithdrawalsQuery';
import TextAd from 'ui/shared/ad/TextAd';
import ServiceDegradationWarning from 'ui/shared/alerts/ServiceDegradationWarning';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import TxsWithFrontendSorting from 'ui/txs/TxsWithFrontendSorting';

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
  const appProps = useAppContext();
  const heightOrHash = getQueryParamString(router.query.height_or_hash);
  const tab = getQueryParamString(router.query.tab);

  const blockQuery = useBlockQuery({ heightOrHash });
  const blockTxsQuery = useBlockTxsQuery({ heightOrHash, blockQuery, tab });
  const blockWithdrawalsQuery = useBlockWithdrawalsQuery({ heightOrHash, blockQuery, tab });
  const blockBlobTxsQuery = useBlockBlobTxsQuery({ heightOrHash, blockQuery, tab });

  const hasPagination = !isMobile && (
    (tab === 'txs' && blockTxsQuery.pagination.isVisible) ||
    (tab === 'withdrawals' && blockWithdrawalsQuery.pagination.isVisible)
  );

  const tabs: Array<RoutedTab> = React.useMemo(() => ([
    {
      id: 'index',
      title: 'Details',
      component: (
        <>
          { blockQuery.isDegradedData && <ServiceDegradationWarning isLoading={ blockQuery.isPlaceholderData } mb={ 6 }/> }
          <BlockDetails query={ blockQuery }/>
        </>
      ),
    },
    {
      id: 'txs',
      title: 'Transactions',
      component: (
        <>
          { blockTxsQuery.isDegradedData && <ServiceDegradationWarning isLoading={ blockTxsQuery.isPlaceholderData } mb={ 6 }/> }
          <TxsWithFrontendSorting query={ blockTxsQuery } showBlockInfo={ false } showSocketInfo={ false } top={ hasPagination ? TABS_HEIGHT : 0 }/>
        </>
      ),
    },
    config.features.dataAvailability.isEnabled && blockQuery.data?.blob_tx_count ?
      {
        id: 'blob_txs',
        title: 'Blob txns',
        component: (
          <TxsWithFrontendSorting query={ blockBlobTxsQuery } showBlockInfo={ false } showSocketInfo={ false }/>
        ),
      } : null,
    config.features.beaconChain.isEnabled && Boolean(blockQuery.data?.withdrawals_count) ?
      {
        id: 'withdrawals',
        title: 'Withdrawals',
        component: (
          <>
            { blockWithdrawalsQuery.isDegradedData && <ServiceDegradationWarning isLoading={ blockWithdrawalsQuery.isPlaceholderData } mb={ 6 }/> }
            <BlockWithdrawals blockWithdrawalsQuery={ blockWithdrawalsQuery }/>
          </>
        ),
      } : null,
    blockQuery.data?.celo?.is_epoch_block ? {
      id: 'epoch_rewards',
      title: 'Epoch rewards',
      component: <BlockEpochRewards heightOrHash={ heightOrHash }/>,
    } : null,
  ].filter(Boolean)), [ blockBlobTxsQuery, blockQuery, blockTxsQuery, blockWithdrawalsQuery, hasPagination, heightOrHash ]);

  let pagination;
  if (tab === 'txs') {
    pagination = blockTxsQuery.pagination;
  } else if (tab === 'withdrawals') {
    pagination = blockWithdrawalsQuery.pagination;
  }

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/blocks');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to blocks list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  throwOnAbsentParamError(heightOrHash);

  if (blockQuery.isError) {
    if (!blockQuery.isDegradedData && blockQuery.error.status === 404 && !heightOrHash.startsWith('0x')) {
      router.push({ pathname: '/block/countdown/[height]', query: { height: heightOrHash } });
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
  const contentAfter = (() => {
    if (!blockQuery.data?.celo) {
      return null;
    }

    if (!blockQuery.data.celo.is_epoch_block) {
      return (
        <Tooltip label="Displays the epoch this block belongs to before the epoch is finalized" maxW="280px" textAlign="center">
          <Tag>Epoch #{ blockQuery.data.celo.epoch_number }</Tag>
        </Tooltip>
      );
    }

    return (
      <Tooltip label="Displays the epoch finalized by this block" maxW="280px" textAlign="center">
        <Tag bgColor="celo" color="blackAlpha.800">Finalized epoch #{ blockQuery.data.celo.epoch_number }</Tag>
      </Tooltip>
    );
  })();
  const titleSecondRow = (
    <>
      { !config.UI.views.block.hiddenFields?.miner && blockQuery.data?.miner && (
        <Skeleton
          isLoaded={ !blockQuery.isPlaceholderData }
          fontFamily="heading"
          display="flex"
          minW={ 0 }
          columnGap={ 2 }
          fontWeight={ 500 }
        >
          <chakra.span flexShrink={ 0 }>
            { `${ capitalize(getNetworkValidationActionText()) } by` }
          </chakra.span>
          <AddressEntity address={ blockQuery.data.miner }/>
        </Skeleton>
      ) }
      <NetworkExplorers type="block" pathParam={ heightOrHash } ml={{ base: config.UI.views.block.hiddenFields?.miner ? 0 : 3, lg: 'auto' }}/>
    </>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ title }
        backLink={ backLink }
        contentAfter={ contentAfter }
        secondRow={ titleSecondRow }
        isLoading={ blockQuery.isPlaceholderData }
      />
      { blockQuery.isPlaceholderData ? <TabsSkeleton tabs={ tabs }/> : (
        <RoutedTabs
          tabs={ tabs }
          tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
          rightSlot={ hasPagination ? <Pagination { ...(pagination as PaginationParams) }/> : null }
          stickyEnabled={ hasPagination }
        />
      ) }
    </>
  );
};

export default BlockPageContent;
