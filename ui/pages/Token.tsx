import { Skeleton, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import Pagination from 'ui/shared/Pagination';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
import TokenContractInfo from 'ui/token/TokenContractInfo';
import TokenDetails from 'ui/token/TokenDetails';
import TokenHolders from 'ui/token/TokenHolders/TokenHolders';
import TokenTransfer from 'ui/token/TokenTransfer/TokenTransfer';

export type TokenTabs = 'token_transfers' | 'holders'

const TokenPageContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const tokenQuery = useApiQuery('token', {
    pathParams: { hash: router.query.hash?.toString() },
    queryOptions: { enabled: Boolean(router.query.hash) },
  });

  useEffect(() => {
    if (tokenQuery.data) {
      const tokenName = `${ tokenQuery.data.name } (${ tokenQuery.data.symbol })`;
      const title = document.getElementsByTagName('title')[0];
      if (title) {
        title.textContent = title.textContent?.replace(tokenQuery.data.address, tokenName) || title.textContent;
      }
      const description = document.getElementsByName('description')[0] as HTMLMetaElement;
      if (description) {
        description.content = description.content.replace(tokenQuery.data.address, tokenName) || description.content;
      }
    }
  }, [ tokenQuery.data ]);

  const transfersQuery = useQueryWithPages({
    resourceName: 'token_transfers',
    pathParams: { hash: router.query.hash?.toString() },
    scrollRef,
    options: {
      enabled: Boolean(router.query.hash && (!router.query.tab || router.query.tab === 'token_transfers') && tokenQuery.data),
    },
  });

  const holdersQuery = useQueryWithPages({
    resourceName: 'token_holders',
    pathParams: { hash: router.query.hash?.toString() },
    scrollRef,
    options: {
      enabled: Boolean(router.query.hash && router.query.tab === 'holders' && tokenQuery.data),
    },
  });

  const tabs: Array<RoutedTab> = [
    { id: 'token_transfers', title: 'Token transfers', component: <TokenTransfer transfersQuery={ transfersQuery } token={ tokenQuery.data }/> },
    { id: 'holders', title: 'Holders', component: <TokenHolders tokenQuery={ tokenQuery } holdersQuery={ holdersQuery }/> },
  ];

  let hasPagination;
  let pagination;

  if (!router.query.tab || router.query.tab === 'token_transfers') {
    hasPagination = transfersQuery.isPaginationVisible;
    pagination = transfersQuery.pagination;
  }

  if (router.query.tab === 'holders') {
    hasPagination = holdersQuery.isPaginationVisible;
    pagination = holdersQuery.pagination;
  }

  return (
    <Page>
      { tokenQuery.isLoading ?
        <Skeleton w="500px" h={ 10 } mb={ 6 }/> :
        <PageTitle text={ `${ tokenQuery.data?.name } (${ tokenQuery.data?.symbol }) token` }/> }
      <TokenContractInfo tokenQuery={ tokenQuery }/>
      <TokenDetails tokenQuery={ tokenQuery }/>

      { /* should stay before tabs to scroll up whith pagination */ }
      <Box ref={ scrollRef }></Box>

      <RoutedTabs
        tabs={ tabs }
        tabListProps={ isMobile ? { mt: 8 } : { mt: 3, py: 5, marginBottom: 0 } }
        rightSlot={ !isMobile && hasPagination ? <Pagination { ...(pagination as PaginationProps) }/> : null }
        stickyEnabled={ !isMobile }
      />
    </Page>
  );
};

export default TokenPageContent;
