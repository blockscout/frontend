import { Flex, Tag } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/appContext';
import networkExplorers from 'lib/networks/networkExplorers';
import getQueryParamString from 'lib/router/getQueryParamString';
import TextAd from 'ui/shared/ad/TextAd';
import LinkExternal from 'ui/shared/LinkExternal';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
import TxDetails from 'ui/tx/TxDetails';
import TxInternals from 'ui/tx/TxInternals';
import TxLogs from 'ui/tx/TxLogs';
import TxRawTrace from 'ui/tx/TxRawTrace';
import TxState from 'ui/tx/TxState';
import TxTokenTransfer from 'ui/tx/TxTokenTransfer';

const TABS: Array<RoutedTab> = [
  { id: 'index', title: 'Details', component: <TxDetails/> },
  { id: 'token_transfers', title: 'Token transfers', component: <TxTokenTransfer/> },
  { id: 'internal', title: 'Internal txns', component: <TxInternals/> },
  { id: 'logs', title: 'Logs', component: <TxLogs/> },
  { id: 'state', title: 'State', component: <TxState/> },
  { id: 'raw_trace', title: 'Raw trace', component: <TxRawTrace/> },
];

const TransactionPageContent = () => {
  const router = useRouter();
  const appProps = useAppContext();

  const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/txs');
  const hash = getQueryParamString(router.query.hash);

  const { data } = useApiQuery('tx', {
    pathParams: { hash },
    queryOptions: { enabled: Boolean(hash) },
  });

  const explorersLinks = networkExplorers
    .filter((explorer) => explorer.paths.tx)
    .map((explorer) => {
      const url = new URL(explorer.paths.tx + '/' + hash, explorer.baseUrl);
      return <LinkExternal key={ explorer.baseUrl } href={ url.toString() }>Open in { explorer.title }</LinkExternal>;
    });

  const additionals = (
    <Flex justifyContent="space-between" alignItems="center" flexGrow={ 1 } flexWrap="wrap">
      { data?.tx_tag && <Tag my={ 2 }>{ data.tx_tag }</Tag> }
      { explorersLinks.length > 0 && (
        <Flex
          alignItems="center"
          flexWrap="wrap"
          columnGap={ 6 }
          rowGap={ 3 }
          ml={{ base: 'initial', lg: 'auto' }}
        >
          { explorersLinks }
        </Flex>
      ) }
    </Flex>
  );

  return (
    <Page>
      <TextAd mb={ 6 }/>
      <PageTitle
        text="Transaction details"
        additionalsRight={ additionals }
        backLinkUrl={ hasGoBackLink ? appProps.referrer : undefined }
        backLinkLabel="Back to transactions list"
      />
      <RoutedTabs tabs={ TABS }/>
    </Page>
  );
};

export default TransactionPageContent;
