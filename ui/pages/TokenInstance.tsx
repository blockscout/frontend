import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as metadata from 'lib/metadata';
import * as regexp from 'lib/regexp';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import {
  TOKEN_INSTANCE,
  TOKEN_INFO_ERC_1155,
  getTokenInstanceTransfersStub,
  getTokenInstanceHoldersStub,
} from 'stubs/token';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import TextAd from 'ui/shared/ad/TextAd';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import Tag from 'ui/shared/chakra/Tag';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import LinkExternal from 'ui/shared/links/LinkExternal';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TokenHolders from 'ui/token/TokenHolders/TokenHolders';
import TokenTransfer from 'ui/token/TokenTransfer/TokenTransfer';
import TokenInstanceDetails from 'ui/tokenInstance/TokenInstanceDetails';
import TokenInstanceMetadata from 'ui/tokenInstance/TokenInstanceMetadata';

export type TokenTabs = 'token_transfers' | 'holders'

const TokenInstanceContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const appProps = useAppContext();

  const hash = router.query.hash?.toString();
  const id = router.query.id?.toString();
  const tab = router.query.tab?.toString();

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

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes(`/token/${ hash }`) && !appProps.referrer.includes('instance');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to token page',
      url: appProps.referrer,
    };
  }, [ appProps.referrer, hash ]);

  const tabs: Array<RoutedTab> = [
    {
      id: 'token_transfers',
      title: 'Token transfers',
      component: <TokenTransfer transfersQuery={ transfersQuery } tokenId={ id } token={ tokenQuery.data } shouldRender={ !isLoading }/>,
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

  const tokenTag = tokenQuery.data?.type ? <Tag isLoading={ tokenInstanceQuery.isPlaceholderData }>{ getTokenTypeName(tokenQuery.data?.type) }</Tag> : null;

  const address = {
    hash: hash || '',
    is_contract: true,
    implementations: null,
    watchlist_names: [],
    watchlist_address_id: null,
  };

  const appLink = (() => {
    if (!tokenInstanceQuery.data?.external_app_url) {
      return null;
    }

    try {
      const url = regexp.URL_PREFIX.test(tokenInstanceQuery.data.external_app_url) ?
        new URL(tokenInstanceQuery.data.external_app_url) :
        new URL('https://' + tokenInstanceQuery.data.external_app_url);

      return (
        <LinkExternal href={ url.toString() } variant="subtle" isLoading={ isLoading } ml={{ base: 0, lg: 'auto' }}>
          { url.hostname || tokenInstanceQuery.data.external_app_url }
        </LinkExternal>
      );
    } catch (error) {
      return (
        <LinkExternal href={ tokenInstanceQuery.data.external_app_url } isLoading={ isLoading } ml={{ base: 0, lg: 'auto' }}>
            View in app
        </LinkExternal>
      );
    }
  })();

  let pagination: PaginationParams | undefined;

  if (tab === 'token_transfers') {
    pagination = transfersQuery.pagination;
  } else if (tab === 'holders') {
    pagination = holdersQuery.pagination;
  }

  const title = (() => {
    if (typeof tokenInstanceQuery.data?.metadata?.name === 'string') {
      return tokenInstanceQuery.data.metadata.name;
    }

    if (tokenQuery.data?.symbol) {
      return (tokenQuery.data.name || tokenQuery.data.symbol) + ' #' + tokenInstanceQuery.data?.id;
    }

    return `ID ${ tokenInstanceQuery.data?.id }`;
  })();

  const titleSecondRow = (
    <Flex alignItems="center" w="100%" minW={ 0 } columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      { tokenQuery.data && (
        <TokenEntity
          token={ tokenQuery.data }
          isLoading={ isLoading }
          noSymbol
          noCopy
          jointSymbol
          fontFamily="heading"
          fontSize="lg"
          fontWeight={ 500 }
          w="auto"
          maxW="700px"
        />
      ) }
      { !isLoading && tokenInstanceQuery.data && <AddressAddToWallet token={ tokenQuery.data } variant="button"/> }
      <AddressQrCode address={ address } isLoading={ isLoading }/>
      <AccountActionsMenu isLoading={ isLoading }/>
      { appLink }
    </Flex>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ title }
        backLink={ backLink }
        contentAfter={ tokenTag }
        secondRow={ titleSecondRow }
        isLoading={ isLoading }
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
    </>
  );
};

export default React.memo(TokenInstanceContent);
