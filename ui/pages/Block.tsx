import { Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import appConfig from 'configs/app/config';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/appContext';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import getQueryParamString from 'lib/router/getQueryParamString';
import BlockDetails from 'ui/block/BlockDetails';
import BlockWithdrawals from 'ui/block/BlockWithdrawals';
import TextAd from 'ui/shared/ad/TextAd';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import Pagination from 'ui/shared/Pagination';
import SkeletonTabs from 'ui/shared/skeletons/SkeletonTabs';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TxsContent from 'ui/txs/TxsContent';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  py: 5,
  marginTop: -5,
};

const BlockPageContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const appProps = useAppContext();
  const height = getQueryParamString(router.query.height);
  const tab = getQueryParamString(router.query.tab);

  const blockQuery = useApiQuery('block', {
    pathParams: { height },
    queryOptions: { enabled: Boolean(height) },
  });

  const blockTxsQuery = useQueryWithPages({
    resourceName: 'block_txs',
    pathParams: { height },
    options: {
      enabled: Boolean(blockQuery.data?.height && tab === 'txs'),
    },
  });

  const blockWithdrawalsQuery = useQueryWithPages({
    resourceName: 'block_withdrawals',
    pathParams: { height },
    options: {
      enabled: Boolean(blockQuery.data?.height && appConfig.beaconChain.hasBeaconChain && tab === 'withdrawals'),
    },
  });

  if (!height) {
    throw new Error('Block not found', { cause: { status: 404 } });
  }

  if (blockQuery.isError) {
    throw new Error(undefined, { cause: blockQuery.error });
  }

  const tabs: Array<RoutedTab> = React.useMemo(() => ([
    { id: 'index', title: 'Details', component: <BlockDetails query={ blockQuery }/> },
    { id: 'txs', title: 'Transactions', component: <TxsContent query={ blockTxsQuery } showBlockInfo={ false } showSocketInfo={ false }/> },
    appConfig.beaconChain.hasBeaconChain && blockQuery.data?.has_beacon_chain_withdrawals ?
      { id: 'withdrawals', title: 'Withdrawals', component: <BlockWithdrawals blockWithdrawalsQuery={ blockWithdrawalsQuery }/> } :
      null,
  ].filter(Boolean)), [ blockQuery, blockTxsQuery, blockWithdrawalsQuery ]);

  const hasPagination = !isMobile && (
    (tab === 'txs' && blockTxsQuery.isPaginationVisible) ||
    (tab === 'withdrawals' && blockWithdrawalsQuery.isPaginationVisible)
  );

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

  return (
    <>
      { blockQuery.isLoading ? <Skeleton h={{ base: 12, lg: 6 }} mb={ 6 } w="100%" maxW="680px"/> : <TextAd mb={ 6 }/> }
      { blockQuery.isLoading ? (
        <Skeleton h={ 10 } w="300px" mb={ 6 }/>
      ) : (
        <PageTitle
          title={ `Block #${ blockQuery.data?.height }` }
          backLink={ backLink }
          contentAfter={ <NetworkExplorers type="block" pathParam={ height } ml={{ base: 'initial', lg: 'auto' }}/> }
          withTextAd
        />
      ) }
      { blockQuery.isLoading ? <SkeletonTabs/> : (
        <RoutedTabs
          tabs={ tabs }
          tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
          rightSlot={ hasPagination ? <Pagination { ...(pagination as PaginationProps) }/> : null }
          stickyEnabled={ hasPagination }
        />
      ) }
    </>
  );
};

export default BlockPageContent;
