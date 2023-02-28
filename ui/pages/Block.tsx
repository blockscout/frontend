import { Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/appContext';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import getQueryParamString from 'lib/router/getQueryParamString';
import BlockDetails from 'ui/block/BlockDetails';
import TextAd from 'ui/shared/ad/TextAd';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
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
      enabled: Boolean(height && tab === 'txs'),
    },
  });

  if (!height) {
    throw new Error('Block not found', { cause: { status: 404 } });
  }

  const tabs: Array<RoutedTab> = React.useMemo(() => ([
    { id: 'index', title: 'Details', component: <BlockDetails query={ blockQuery }/> },
    { id: 'txs', title: 'Transactions', component: <TxsContent query={ blockTxsQuery } showBlockInfo={ false } showSocketInfo={ false }/> },
  ]), [ blockQuery, blockTxsQuery ]);

  const hasPagination = !isMobile && tab === 'txs' && blockTxsQuery.isPaginationVisible;

  const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/blocks');

  return (
    <Page>
      { blockQuery.isLoading ? <Skeleton h={{ base: 12, lg: 6 }} mb={ 6 } w="100%" maxW="680px"/> : <TextAd mb={ 6 }/> }
      { blockQuery.isLoading ? (
        <Skeleton h={ 10 } w="300px" mb={ 6 }/>
      ) : (
        <PageTitle
          text={ `Block #${ blockQuery.data?.height }` }
          backLinkUrl={ hasGoBackLink ? appProps.referrer : undefined }
          backLinkLabel="Back to blocks list"
        />
      ) }
      <RoutedTabs
        tabs={ tabs }
        tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ hasPagination ? <Pagination { ...blockTxsQuery.pagination }/> : null }
        stickyEnabled={ hasPagination }
      />
    </Page>
  );
};

export default BlockPageContent;
