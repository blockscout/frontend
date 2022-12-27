import { Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Element } from 'react-scroll';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
import TokenContractInfo from 'ui/token/TokenContractInfo';
import TokenDetails from 'ui/token/TokenDetails';

export type TokenTabs = 'token_transfers' | 'holders'

const TokenPageContent = () => {
  const router = useRouter();

  const tokenQuery = useApiQuery('token', {
    pathParams: { hash: router.query.hash?.toString() },
    queryOptions: { enabled: Boolean(router.query.hash) },
  });

  const tabs: Array<RoutedTab> = [
    { id: 'token_transfers', title: 'Token transfers', component: null },
    { id: 'holders', title: 'Holders', component: null },
  ];

  if (tokenQuery.isError) {
    return <DataFetchAlert/>;
  }

  return (
    <Page>
      { tokenQuery.isLoading ?
        <Skeleton w="500px" h={ 10 } mb={ 6 }/> :
        <PageTitle text={ `${ tokenQuery.data.name } (${ tokenQuery.data.symbol }) token` }/> }
      <TokenContractInfo tokenQuery={ tokenQuery }/>
      <TokenDetails tokenQuery={ tokenQuery }/>
      <Element name="token-tabs"><RoutedTabs tabs={ tabs } tabListProps={{ mt: 8 }}/></Element>
    </Page>
  );
};

export default TokenPageContent;
