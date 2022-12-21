import { Flex, Link, Icon, Tag } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Script from 'next/script';
import React from 'react';

import type { Transaction } from 'types/api/transaction';
import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import eastArrowIcon from 'icons/arrows/east.svg';
import { useAppContext } from 'lib/appContext';
import useFetch from 'lib/hooks/useFetch';
import isBrowser from 'lib/isBrowser';
import networkExplorers from 'lib/networks/networkExplorers';
import AdBanner from 'ui/shared/ad/AdBanner';
import ExternalLink from 'ui/shared/ExternalLink';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
import TxDetails from 'ui/tx/TxDetails';
import TxInternals from 'ui/tx/TxInternals';
import TxLogs from 'ui/tx/TxLogs';
import TxRawTrace from 'ui/tx/TxRawTrace';
import TxTokenTransfer from 'ui/tx/TxTokenTransfer';
// import TxState from 'ui/tx/TxState';

const TABS: Array<RoutedTab> = [
  { id: 'index', title: 'Details', component: <TxDetails/> },
  { id: 'token_transfers', title: 'Token transfers', component: <TxTokenTransfer/> },
  { id: 'internal', title: 'Internal txns', component: <TxInternals/> },
  { id: 'logs', title: 'Logs', component: <TxLogs/> },
  // will be implemented later, api is not ready
  // { id: 'state', title: 'State', component: <TxState/> },
  { id: 'raw_trace', title: 'Raw trace', component: <TxRawTrace/> },
];

const TransactionPageContent = () => {
  const router = useRouter();
  const fetch = useFetch();
  const appProps = useAppContext();
  const isInBrowser = isBrowser();

  const referrer = isInBrowser ? window.document.referrer : appProps.referrer;

  const hasGoBackLink = referrer && referrer.includes('/txs');

  const { data } = useQuery<unknown, unknown, Transaction>(
    [ 'tx', router.query.id ],
    async() => await fetch(`/node-api/transactions/${ router.query.id }`),
    {
      enabled: Boolean(router.query.id),
    },
  );

  const explorersLinks = networkExplorers
    .filter((explorer) => explorer.paths.tx)
    .map((explorer) => {
      const url = new URL(explorer.paths.tx + '/' + router.query.id, explorer.baseUrl);
      return <ExternalLink key={ explorer.baseUrl } title={ `Open in ${ explorer.title }` } href={ url.toString() }/>;
    });

  return (
    <Page>
      { hasGoBackLink && (
        <Link mb={ 6 } display="inline-flex" href={ referrer }>
          <Icon as={ eastArrowIcon } boxSize={ 6 } mr={ 2 } transform="rotate(180deg)"/>
            Transactions
        </Link>
      ) }
      <Flex alignItems="flex-start" flexDir={{ base: 'column', lg: 'row' }}>
        <PageTitle text="Transaction details"/>
        { data?.tx_tag && <Tag my={ 2 } ml={ 3 }>{ data.tx_tag }</Tag> }
        { explorersLinks.length > 0 && (
          <Flex
            alignItems="center"
            flexWrap="wrap"
            columnGap={ 6 }
            rowGap={ 3 }
            ml={{ base: 'initial', lg: 'auto' }}
            mb={{ base: 6, lg: 'initial' }}
            py={ 2.5 }
          >
            { explorersLinks }
          </Flex>
        ) }
      </Flex>
      <RoutedTabs tabs={ TABS }/>
      <AdBanner mt={ 6 } justifyContent={{ base: 'center', lg: 'start' }}/>
      <Script src="/static/js/jquery.min.js" strategy="beforeInteractive"/>
    </Page>
  );
};

export default TransactionPageContent;
