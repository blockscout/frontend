import { useRouter } from 'next/router';
import React from 'react';

import { QueryKeys } from 'types/client/queries';
import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import BlockDetails from 'ui/block/BlockDetails';
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

  const blockTxsQuery = useQueryWithPages({
    apiPath: `/node-api/blocks/${ router.query.id }/transactions`,
    queryName: QueryKeys.blockTxs,
    options: {
      enabled: Boolean(router.query.id && router.query.tab === 'txs'),
    },
  });

  if (!router.query.id) {
    return null;
  }

  const tabs: Array<RoutedTab> = [
    { id: 'index', title: 'Details', component: <BlockDetails/> },
    { id: 'txs', title: 'Transactions', component: <TxsContent query={ blockTxsQuery } showBlockInfo={ false } showSocketInfo={ false }/> },
  ];

  return (
    <Page>
      <PageTitle text={ `Block #${ router.query.id }` }/>
      <RoutedTabs
        tabs={ tabs }
        tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ isMobile ? null : <Pagination { ...blockTxsQuery.pagination }/> }
        stickyEnabled={ !isMobile }
      />
    </Page>
  );
};

export default BlockPageContent;
