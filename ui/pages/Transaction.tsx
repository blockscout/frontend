import { Box, Skeleton, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import lightning from 'icons/lightning.svg';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useFetchTranslate from 'lib/hooks/useFetchTranslate';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TRANSLATE } from 'stubs/translate';
import { TX } from 'stubs/tx';
import TextAd from 'ui/shared/ad/TextAd';
import Icon from 'ui/shared/chakra/Icon';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import EntityTags from 'ui/shared/EntityTags';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import useTabIndexFromQuery from 'ui/shared/Tabs/useTabIndexFromQuery';
import TokenTransferSnippet from 'ui/tx/assetFlows/TokenTransferSnippet';
import { getFlowCount, getSplittedDescription } from 'ui/tx/assetFlows/utils/generateFlowViewData';
import TxAssetFlows from 'ui/tx/TxAssetFlows';
import TxDetails from 'ui/tx/TxDetails';
import TxDetailsWrapped from 'ui/tx/TxDetailsWrapped';
import TxInternals from 'ui/tx/TxInternals';
import TxLogs from 'ui/tx/TxLogs';
import TxRawTrace from 'ui/tx/TxRawTrace';
import TxState from 'ui/tx/TxState';
import TxTokenTransfer from 'ui/tx/TxTokenTransfer';

const TransactionPageContent = () => {
  const router = useRouter();
  const appProps = useAppContext();

  const hash = getQueryParamString(router.query.hash);

  const fetchTranslate = useFetchTranslate(hash, {
    queryOptions: {
      placeholderData: TRANSLATE,
    },
  });

  const { data: translateData, isError, isPlaceholderData: isTranslatePlaceholder } = fetchTranslate;

  const { data, isPlaceholderData } = useApiQuery('tx', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: TX,
    },
  });

  const tabs: Array<RoutedTab> = [
    { id: 'index', title: config.features.suave.isEnabled && data?.wrapped ? 'Confidential compute tx details' : 'Details', component: <TxDetails/> },
    { id: 'asset_flows', title: 'Asset Flows', component: <TxAssetFlows data={ fetchTranslate }/>, count: getFlowCount(translateData) },
    config.features.suave.isEnabled && data?.wrapped ?
      { id: 'wrapped', title: 'Regular tx details', component: <TxDetailsWrapped data={ data.wrapped }/> } :
      undefined,
    { id: 'token_transfers', title: 'Token transfers', component: <TxTokenTransfer/> },
    { id: 'internal', title: 'Internal txns', component: <TxInternals/> },
    { id: 'logs', title: 'Logs', component: <TxLogs/> },
    { id: 'state', title: 'State', component: <TxState/> },
    { id: 'raw_trace', title: 'Raw trace', component: <TxRawTrace/> },
  ].filter(Boolean);

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

  const getTransactionDescription = useCallback(() => {
    if (!isError && translateData) {
      if (translateData.classificationData.description) {
        const description = getSplittedDescription(translateData);

        return description.map((item, i) => (
          <>
            <Text fontWeight="500" fontSize="lg" display="inline-flex" alignItems="center" gap={ 2 } wordBreak="break-word">
              { i === 0 && (
                <Icon
                  as={ lightning }
                  display="flex"
                  fontSize="xl"
                  color="#718096"
                  _dark={{ color: '#92a2bb' }}
                />
              ) }
              { item.text }
            </Text>
            { item.hasId ? (
              /* eslint-disable @typescript-eslint/no-non-null-assertion */
              <TokenTransferSnippet
                token={ item.token! }
                tokenId={ item.token?.id || '' }
              />
            ) :
              item.token && (
                <TokenEntity
                  token={ item.token }
                  noCopy
                  noSymbol
                  fontWeight="500"
                  fontSize="lg"
                  w="fit-content"
                />
              ) }

          </>
        ));
      } else {
        return 'Error fetching transaction description';
      }
    } else {
      return 'Error fetching transaction description';
    }
  }, [ isError, translateData ]);

  const titleSecondRow = (
    <Skeleton isLoaded={ !isTranslatePlaceholder } overflow="hidden">
      <Box display="flex" gap={ 2 } alignItems="center" flexWrap="wrap">
        { getTransactionDescription() }
      </Box>
    </Skeleton>
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
      { isPlaceholderData ? (
        <>
          <TabsSkeleton tabs={ tabs } mt={ 6 }/>
          { tabs[tabIndex]?.component }
        </>
      ) : <RoutedTabs tabs={ tabs }/> }
    </>
  );
};

export default TransactionPageContent;
