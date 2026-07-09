// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import useApiQuery from 'src/api/hooks/useApiQuery';

import * as metadata from 'src/shell/metadata';

import TokenTransfer from 'src/slices/token-transfer/pages/token/TokenTransfer';
import TokenHolders from 'src/slices/token/pages/details/holders/TokenHolders';
import TokenInstanceDetails from 'src/slices/token/pages/instance/info/TokenInstanceDetails';
import { MetadataUpdateProvider } from 'src/slices/token/pages/instance/metadata-update-context';
import TokenInstanceMetadata from 'src/slices/token/pages/instance/metadata/TokenInstanceMetadata';
import TokenInstanceMetadataFetcher from 'src/slices/token/pages/instance/TokenInstanceMetadataFetcher';
import TokenInstancePageTitle from 'src/slices/token/pages/instance/TokenInstancePageTitle';
import {
  TOKEN_INSTANCE,
  TOKEN_INFO_ERC_1155,
} from 'src/slices/token/stubs';

import TextAd from 'src/features/ads/text/components/TextAd';

import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

const TokenInstanceContent = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const id = getQueryParamString(router.query.id);

  const tokenQuery = useApiQuery('core:token', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash && id),
      placeholderData: TOKEN_INFO_ERC_1155,
    },
  });

  const tokenInstanceQuery = useApiQuery('core:token_instance', {
    pathParams: { hash, id },
    queryOptions: {
      enabled: Boolean(hash && id),
      placeholderData: TOKEN_INSTANCE,
    },
  });

  const shouldFetchHolders =
    !tokenQuery.isPlaceholderData &&
    !tokenInstanceQuery.isPlaceholderData &&
    tokenInstanceQuery.data &&
    !tokenInstanceQuery.data.is_unique;

  const isLoading = tokenInstanceQuery.isPlaceholderData || tokenQuery.isPlaceholderData;

  React.useEffect(() => {
    if (tokenInstanceQuery.data && !tokenInstanceQuery.isPlaceholderData && tokenQuery.data && !tokenQuery.isPlaceholderData) {
      metadata.update(
        { pathname: '/token/[hash]/instance/[id]', query: { hash: tokenQuery.data.address_hash, id: tokenInstanceQuery.data.id } },
        { symbol_or_name: tokenQuery.data.symbol ?? tokenQuery.data.name ?? '' },
      );
    }
  }, [ tokenInstanceQuery.data, tokenInstanceQuery.isPlaceholderData, tokenQuery.data, tokenQuery.isPlaceholderData ]);

  const tabs: Array<TabItemRegular> = [
    {
      id: 'index',
      title: 'Details',
      component: (
        <TokenInstanceDetails
          data={ tokenInstanceQuery?.data }
          isLoading={ isLoading }
          token={ tokenQuery.data }
        />
      ),
    },
    {
      id: 'token_transfers',
      title: 'Token transfers',
      component: (
        <TokenTransfer
          token={ tokenQuery.data }
          tokenId={ id }
          tokenInstance={ tokenInstanceQuery.data }
          isLoading={ isLoading }
        />
      ),
    },
    shouldFetchHolders ?
      {
        id: 'holders',
        title: 'Holders',
        component: <TokenHolders tokenId={ id } token={ tokenQuery.data } isLoading={ isLoading }/>,
      } :
      undefined,
    {
      id: 'metadata',
      title: 'Metadata',
      component: <TokenInstanceMetadata data={ tokenInstanceQuery.data?.metadata } isPlaceholderData={ isLoading }/> },
  ].filter(Boolean);

  throwOnResourceLoadError(tokenInstanceQuery);

  return (
    <MetadataUpdateProvider>
      <TextAd mb={ 6 }/>

      <TokenInstancePageTitle
        isLoading={ isLoading }
        token={ tokenQuery.data }
        instance={ tokenInstanceQuery.data }
        hash={ hash }
      />

      <RoutedTabs tabs={ tabs } isLoading={ isLoading }/>

      <TokenInstanceMetadataFetcher hash={ hash } id={ id }/>
    </MetadataUpdateProvider>
  );
};

export default React.memo(TokenInstanceContent);
