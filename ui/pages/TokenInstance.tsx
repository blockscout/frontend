import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as metadata from 'lib/metadata';
import * as regexp from 'lib/regexp';
import { TOKEN_INSTANCE, TOKEN_INFO_ERC_1155 } from 'stubs/token';
import * as tokenStubs from 'stubs/token';
import { generateListStub } from 'stubs/utils';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import TextAd from 'ui/shared/ad/TextAd';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import Tag from 'ui/shared/chakra/Tag';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import LinkExternal from 'ui/shared/LinkExternal';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
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
      enabled: Boolean(hash && id && (!tab || tab === 'token_transfers') && !tokenInstanceQuery.isPlaceholderData && tokenInstanceQuery.data),
      placeholderData: generateListStub<'token_instance_transfers'>(
        tokenQuery.data?.type === 'ERC-1155' ? tokenStubs.TOKEN_TRANSFER_ERC_1155 : tokenStubs.TOKEN_TRANSFER_ERC_721,
        10,
        { next_page_params: null },
      ),
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
      placeholderData: generateListStub<'token_instance_holders'>(
        tokenQuery.data?.type === 'ERC-1155' ? tokenStubs.TOKEN_HOLDER_ERC_1155 : tokenStubs.TOKEN_HOLDER_ERC_20, 10, { next_page_params: null }),
    },
  });

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
      component: <TokenTransfer transfersQuery={ transfersQuery } tokenId={ id } token={ tokenQuery.data }/>,
    },
    shouldFetchHolders ?
      { id: 'holders', title: 'Holders', component: <TokenHolders holdersQuery={ holdersQuery } token={ tokenQuery.data }/> } :
      undefined,
    { id: 'metadata', title: 'Metadata', component: (
      <TokenInstanceMetadata
        data={ tokenInstanceQuery.data?.metadata }
        isPlaceholderData={ tokenInstanceQuery.isPlaceholderData }
      />
    ) },
  ].filter(Boolean);

  if (tokenInstanceQuery.isError) {
    throw Error('Token instance fetch failed', { cause: tokenInstanceQuery.error });
  }

  const tokenTag = <Tag isLoading={ tokenInstanceQuery.isPlaceholderData }>{ tokenQuery.data?.type }</Tag>;

  const address = {
    hash: hash || '',
    is_contract: true,
    implementation_name: null,
    watchlist_names: [],
    watchlist_address_id: null,
  };

  const isLoading = tokenInstanceQuery.isPlaceholderData || tokenQuery.isPlaceholderData;

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

  const titleSecondRow = (
    <Flex alignItems="center" w="100%" minW={ 0 } columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
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
        title={ `ID ${ tokenInstanceQuery.data?.id }` }
        backLink={ backLink }
        contentAfter={ tokenTag }
        secondRow={ titleSecondRow }
        isLoading={ isLoading }
      />

      <TokenInstanceDetails data={ tokenInstanceQuery?.data } isLoading={ isLoading } scrollRef={ scrollRef } token={ tokenQuery.data }/>

      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>

      { isLoading ? <TabsSkeleton tabs={ tabs }/> : (
        <RoutedTabs
          tabs={ tabs }
          tabListProps={ isMobile ? { mt: 8 } : { mt: 3, py: 5, marginBottom: 0 } }
          rightSlot={ !isMobile && pagination?.isVisible ? <Pagination { ...pagination }/> : null }
          stickyEnabled={ !isMobile }
        />
      ) }
    </>
  );
};

export default React.memo(TokenInstanceContent);
