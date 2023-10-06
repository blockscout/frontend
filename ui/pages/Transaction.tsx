import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TX } from 'stubs/tx';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import TextAd from 'ui/shared/ad/TextAd';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import EntityTags from 'ui/shared/EntityTags';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
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

  const hash = getQueryParamString(router.query.hash);

  const { data, isPlaceholderData } = useApiQuery('tx', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: TX,
    },
  });

  const tags = (
    <EntityTags
      isLoading={ isPlaceholderData }
      tagsBefore={ [ data?.tx_tag ? { label: data.tx_tag, display_name: data.tx_tag } : undefined ] }
    />
  );

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/txs');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to transactions list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const titleSecondRow = (
    <>
      <TxEntity hash={ hash } noLink noCopy={ false } fontWeight={ 500 } mr={ 2 } fontFamily="heading"/>
      { !data?.tx_tag && <AccountActionsMenu mr={{ base: 0, lg: 3 }}/> }
      <NetworkExplorers type="tx" pathParam={ hash } ml={{ base: 3, lg: 'auto' }}/>
    </>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Transaction details"
        backLink={ backLink }
        contentAfter={ tags }
        secondRow={ titleSecondRow }
      />
      <RoutedTabs tabs={ TABS }/>
    </>
  );
};

export default TransactionPageContent;
