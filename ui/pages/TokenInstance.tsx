import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as metadata from 'lib/metadata';
import getQueryParamString from 'lib/router/getQueryParamString';
import {
  TOKEN_INSTANCE,
  TOKEN_INFO_ERC_1155,
  getTokenInstanceTransfersStub,
  getTokenInstanceHoldersStub,
} from 'stubs/token';
import TextAd from 'ui/shared/ad/TextAd';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TokenHolders from 'ui/token/TokenHolders/TokenHolders';
import TokenTransfer from 'ui/token/TokenTransfer/TokenTransfer';
import { MetadataUpdateProvider } from 'ui/tokenInstance/contexts/metadataUpdate';
import TokenInstanceDetails from 'ui/tokenInstance/TokenInstanceDetails';
import TokenInstanceMetadata from 'ui/tokenInstance/TokenInstanceMetadata';
import TokenInstanceMetadataFetcher from 'ui/tokenInstance/TokenInstanceMetadataFetcher';
import TokenInstancePageTitle from 'ui/tokenInstance/TokenInstancePageTitle';

export type TokenTabs = 'token_transfers' | 'holders';

const TokenInstanceContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const hash = getQueryParamString(router.query.hash);
  const id = getQueryParamString(router.query.id);
  const tab = getQueryParamString(router.query.tab);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const tokenQuery = useApiQuery('token', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash && id),
      placeholderData: TOKEN_INFO_ERC_1155,
    },
  });

  const tokenInstanceQuery = useApiQuery('token_instance', {
    pathParams: { hash, id },
    queryOptions: {
      enabled: Boolean(hash && id),
      placeholderData: TOKEN_INSTANCE,
    },
  });

  const transfersQuery = useQueryWithPages({
    resourceName: 'token_instance_transfers',
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
    resourceName: 'token_instance_holders',
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
        { pathname: '/token/[hash]/instance/[id]', query: { hash: tokenQuery.data.address, id: tokenInstanceQuery.data.id } },
        { symbol: tokenQuery.data.symbol ?? '' },
      );
    }
  }, [ tokenInstanceQuery.data, tokenInstanceQuery.isPlaceholderData, tokenQuery.data, tokenQuery.isPlaceholderData ]);

  const tabs: Array<RoutedTab> = [
    {
      id: 'token_transfers',
      title: 'Token transfers',
      component: <TokenTransfer transfersQuery={ transfersQuery } tokenId={ id } tokenQuery={ tokenQuery } shouldRender={ !isLoading }/>,
    },
    shouldFetchHolders ?
      { id: 'holders', title: 'Holders', component: <TokenHolders holdersQuery={ holdersQuery } token={ tokenQuery.data } shouldRender={ !isLoading }/> } :
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

  if (tab === 'token_transfers') {
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
        tabListProps={ isMobile ? { mt: 8 } : { mt: 3, py: 5, marginBottom: 0 } }
        isLoading={ isLoading }
        rightSlot={ !isMobile && pagination?.isVisible ? <Pagination { ...pagination }/> : null }
        stickyEnabled={ !isMobile }
      />

      <TokenInstanceMetadataFetcher hash={ hash } id={ id }/>
    </MetadataUpdateProvider>
  );
};

export default React.memo(TokenInstanceContent);
