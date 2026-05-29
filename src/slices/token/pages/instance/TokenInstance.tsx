// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { PaginationParams } from 'src/shared/pagination/types';
import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import useApiQuery from 'src/api/hooks/useApiQuery';

import * as metadata from 'src/shell/metadata';

import TokenTransfer from 'src/slices/token-transfer/pages/token/TokenTransfer';
import { getTokenInstanceTransfersStub } from 'src/slices/token-transfer/stubs';
import TokenHolders from 'src/slices/token/pages/details/holders/TokenHolders';
import TokenInstanceDetails from 'src/slices/token/pages/instance/info/TokenInstanceDetails';
import { MetadataUpdateProvider } from 'src/slices/token/pages/instance/metadata-update-context';
import TokenInstanceMetadata from 'src/slices/token/pages/instance/metadata/TokenInstanceMetadata';
import TokenInstanceMetadataFetcher from 'src/slices/token/pages/instance/TokenInstanceMetadataFetcher';
import TokenInstancePageTitle from 'src/slices/token/pages/instance/TokenInstancePageTitle';
import {
  TOKEN_INSTANCE,
  TOKEN_INFO_ERC_1155,
  getTokenInstanceHoldersStub,
} from 'src/slices/token/stubs';

import TextAd from 'src/features/ads/text/components/TextAd';

import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

export type TokenTabs = 'token_transfers' | 'holders';

const TokenInstanceContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const hash = getQueryParamString(router.query.hash);
  const id = getQueryParamString(router.query.id);
  const tab = getQueryParamString(router.query.tab);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const tokenQuery = useApiQuery('general:token', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash && id),
      placeholderData: TOKEN_INFO_ERC_1155,
    },
  });

  const tokenInstanceQuery = useApiQuery('general:token_instance', {
    pathParams: { hash, id },
    queryOptions: {
      enabled: Boolean(hash && id),
      placeholderData: TOKEN_INSTANCE,
    },
  });

  const transfersQuery = useQueryWithPages({
    resourceName: 'general:token_instance_transfers',
    pathParams: { hash, id },
    scrollRef,
    options: {
      enabled: Boolean(hash && id && (!tab || tab === 'token_transfers')),
      placeholderData: getTokenInstanceTransfersStub(tokenQuery.data?.type, null),
    },
  });

  const shouldFetchHolders =
    !tokenQuery.isPlaceholderData &&
    !tokenInstanceQuery.isPlaceholderData &&
    tokenInstanceQuery.data &&
    !tokenInstanceQuery.data.is_unique;

  const holdersQuery = useQueryWithPages({
    resourceName: 'general:token_instance_holders',
    pathParams: { hash, id },
    scrollRef,
    options: {
      enabled: Boolean(hash && tab === 'holders' && shouldFetchHolders),
      placeholderData: getTokenInstanceHoldersStub(tokenQuery.data?.type, null),
    },
  });

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
      id: 'token_transfers',
      title: 'Token transfers',
      component: (
        <TokenTransfer
          transfersQuery={ transfersQuery }
          tokenId={ id }
          tokenQuery={ tokenQuery }
          tokenInstance={ tokenInstanceQuery.data }
          shouldRender={ !isLoading }
          tabsHeight={ 80 }
        />
      ),
    },
    shouldFetchHolders ?
      {
        id: 'holders',
        title: 'Holders',
        component: <TokenHolders holdersQuery={ holdersQuery } token={ tokenQuery.data } shouldRender={ !isLoading } tabsHeight={ 80 }/>,
      } :
      undefined,
    { id: 'metadata', title: 'Metadata', component: (
      <TokenInstanceMetadata
        data={ tokenInstanceQuery.data?.metadata }
        isPlaceholderData={ isLoading }
      />
    ) },
  ].filter(Boolean);

  throwOnResourceLoadError(tokenInstanceQuery);

  let pagination: PaginationParams | undefined;

  if (tab === 'token_transfers' || !tab) {
    pagination = transfersQuery.pagination;
  } else if (tab === 'holders') {
    pagination = holdersQuery.pagination;
  }

  return (
    <MetadataUpdateProvider>
      <TextAd mb={ 6 }/>

      <TokenInstancePageTitle
        isLoading={ isLoading }
        token={ tokenQuery.data }
        instance={ tokenInstanceQuery.data }
        hash={ hash }
      />

      <TokenInstanceDetails data={ tokenInstanceQuery?.data } isLoading={ isLoading } scrollRef={ scrollRef } token={ tokenQuery.data }/>

      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>

      <RoutedTabs
        tabs={ tabs }
        listProps={ isMobile ? { mt: 8 } : { mt: 3, py: 5, marginBottom: 0 } }
        isLoading={ isLoading }
        rightSlot={ !isMobile && pagination?.isVisible ? <Pagination { ...pagination }/> : null }
        stickyEnabled={ !isMobile }
      />

      <TokenInstanceMetadataFetcher hash={ hash } id={ id }/>
    </MetadataUpdateProvider>
  );
};

export default React.memo(TokenInstanceContent);
