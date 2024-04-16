import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { publicClient } from 'lib/web3/client';
import TextAd from 'ui/shared/ad/TextAd';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import EntityTags from 'ui/shared/EntityTags';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import useTabIndexFromQuery from 'ui/shared/Tabs/useTabIndexFromQuery';
import TxDetails from 'ui/tx/TxDetails';
import TxDetailsDegraded from 'ui/tx/TxDetailsDegraded';
import TxState from 'ui/tx/TxState';
import TxSubHeading from 'ui/tx/TxSubHeading';
import useTxQuery from 'ui/tx/useTxQuery';

const TransactionPageContent = () => {
  const router = useRouter();
  const appProps = useAppContext();

  const hash = getQueryParamString(router.query.hash);
  const txQuery = useTxQuery();
  const { data, isPlaceholderData, isError, error, errorUpdateCount } = txQuery;

  const showDegradedView = publicClient && (isError || isPlaceholderData) && errorUpdateCount > 0;

  const tabs: Array<RoutedTab> = (() => {
    const detailsComponent = showDegradedView ?
      <TxDetailsDegraded hash={ hash } txQuery={ txQuery }/> :
      <TxDetails txQuery={ txQuery }/>;

    return [
      {
        id: 'index',
        title: config.features.suave.isEnabled && data?.wrapped ? 'Confidential compute tx details' : 'Details',
        component: detailsComponent,
      },
      // txInterpretation.isEnabled && txInterpretation.provider === 'noves' ?
      //   { id: 'asset_flows', title: 'Asset Flows', component: <TxAssetFlows hash={ hash }/> } :
      //   undefined,
      // config.features.suave.isEnabled && data?.wrapped ?
      //   { id: 'wrapped', title: 'Regular tx details', component: <TxDetailsWrapped data={ data.wrapped }/> } :
      //   undefined,
      // { id: 'token_transfers', title: 'Token transfers', component: <TxTokenTransfer txQuery={ txQuery }/> },
      // config.features.userOps.isEnabled ?
      //   { id: 'user_ops', title: 'User operations', component: <TxUserOps txQuery={ txQuery }/> } :
      //   undefined,
      // { id: 'internal', title: 'Internal txns', component: <TxInternals txQuery={ txQuery }/> },
      // txQuery.data?.blob_versioned_hashes?.length ?
      //   { id: 'blobs', title: 'Blobs', component: <TxBlobs txQuery={ txQuery }/> } :
      //   undefined,
      // { id: 'logs', title: 'Logs', component: <TxLogs txQuery={ txQuery }/> },
      { id: 'state', title: 'State', component: <TxState txQuery={ txQuery }/> },
      // { id: 'raw_trace', title: 'Raw trace', component: <TxRawTrace txQuery={ txQuery }/> },
    ].filter(Boolean);
  })();

  const tabIndex = useTabIndexFromQuery(tabs);

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

  const titleSecondRow = <TxSubHeading hash={ hash } hasTag={ Boolean(data?.tx_tag) } txQuery={ txQuery }/>;

  const content = (() => {
    if (isPlaceholderData && !showDegradedView) {
      return (
        <>
          <TabsSkeleton tabs={ tabs } mt={ 6 }/>
          { tabs[tabIndex]?.component }
        </>
      );
    }

    return <RoutedTabs tabs={ tabs }/>;
  })();

  if (isError && !showDegradedView) {
    if (isCustomAppError(error)) {
      throwOnResourceLoadError({ resource: 'tx', error, isError: true });
    }
  }

  return (
    <>
      <TextAd mb={ 6 }/>
      <Flex direction="column" paddingX={{ base: 4, lg: 8 }}>
        <PageTitle
          title="Transaction details"
          backLink={ backLink }
          contentAfter={ tags }
          secondRow={ titleSecondRow }
        />
      </Flex>
      <Flex minH="75vh" bg="white"
        borderTopRadius="2.5em"
        paddingY={{
          base: '1em',
          md: '2em',
        }}
        paddingX="1em"
        width="100%"
      >
        { content }
      </Flex>
    </>
  );
};

export default TransactionPageContent;
