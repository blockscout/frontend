import { chakra, Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { BLOCK } from 'stubs/block';
import { TX } from 'stubs/tx';
import { generateListStub } from 'stubs/utils';
import { WITHDRAWAL } from 'stubs/withdrawals';
import BlockDetails from 'ui/block/BlockDetails';
import BlockWithdrawals from 'ui/block/BlockWithdrawals';
import TextAd from 'ui/shared/ad/TextAd';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
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
  const heightOrHash = getQueryParamString(router.query.height_or_hash);
  const tab = getQueryParamString(router.query.tab);

  const blockQuery = useApiQuery('block', {
    pathParams: { height_or_hash: heightOrHash },
    queryOptions: {
      enabled: Boolean(heightOrHash),
      placeholderData: BLOCK,
    },
  });

  const blockTxsQuery = useQueryWithPages({
    resourceName: 'block_txs',
    pathParams: { height_or_hash: heightOrHash },
    options: {
      enabled: Boolean(!blockQuery.isPlaceholderData && blockQuery.data?.height && tab === 'txs'),
      placeholderData: generateListStub<'block_txs'>(TX, 50, { next_page_params: {
        block_number: 9004925,
        index: 49,
        items_count: 50,
      } }),
    },
  });

  const blockWithdrawalsQuery = useQueryWithPages({
    resourceName: 'block_withdrawals',
    pathParams: { height_or_hash: heightOrHash },
    options: {
      enabled: Boolean(!blockQuery.isPlaceholderData && blockQuery.data?.height && config.features.beaconChain.isEnabled && tab === 'withdrawals'),
      placeholderData: generateListStub<'block_withdrawals'>(WITHDRAWAL, 50, { next_page_params: {
        index: 5,
        items_count: 50,
      } }),
    },
  });

  if (!heightOrHash) {
    throw new Error('Block not found', { cause: { status: 404 } });
  }

  if (blockQuery.isError) {
    throw new Error(undefined, { cause: blockQuery.error });
  }

  const tabs: Array<RoutedTab> = React.useMemo(() => ([
    { id: 'index', title: 'Details', component: <BlockDetails query={ blockQuery }/> },
    { id: 'txs', title: 'Transactions', component: <TxsContent query={ blockTxsQuery } showBlockInfo={ false } showSocketInfo={ false }/> },
    config.features.beaconChain.isEnabled && Boolean(blockQuery.data?.withdrawals_count) ?
      { id: 'withdrawals', title: 'Withdrawals', component: <BlockWithdrawals blockWithdrawalsQuery={ blockWithdrawalsQuery }/> } :
      null,
  ].filter(Boolean)), [ blockQuery, blockTxsQuery, blockWithdrawalsQuery ]);

  const hasPagination = !isMobile && (
    (tab === 'txs' && blockTxsQuery.pagination.isVisible) ||
    (tab === 'withdrawals' && blockWithdrawalsQuery.pagination.isVisible)
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

  const title = blockQuery.data?.type === 'reorg' ? `Reorged block #${ blockQuery.data?.height }` : `Block #${ blockQuery.data?.height }`;
  const titleSecondRow = (
    <>
      <Skeleton
        isLoaded={ !blockQuery.isPlaceholderData }
        fontFamily="heading"
        display="flex"
        minW={ 0 }
        columnGap={ 2 }
        fontWeight={ 500 }
      >
        <chakra.span flexShrink={ 0 }>
          { config.chain.verificationType === 'validation' ? 'Validated by' : 'Mined by' }
        </chakra.span>
        <AddressEntity address={ blockQuery.data?.miner }/>
      </Skeleton>
      <NetworkExplorers type="block" pathParam={ heightOrHash } ml={{ base: 3, lg: 'auto' }}/>
    </>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ title }
        backLink={ backLink }
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
