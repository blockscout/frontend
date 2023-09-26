import { Box, Icon, Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import nftIcon from 'icons/nft_shield.svg';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as metadata from 'lib/metadata';
import * as regexp from 'lib/regexp';
import { TOKEN_INSTANCE } from 'stubs/token';
import * as tokenStubs from 'stubs/token';
import { generateListStub } from 'stubs/utils';
import AddressHeadingInfo from 'ui/shared/AddressHeadingInfo';
import Tag from 'ui/shared/chakra/Tag';
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
        tokenInstanceQuery.data?.token.type === 'ERC-1155' ? tokenStubs.TOKEN_TRANSFER_ERC_1155 : tokenStubs.TOKEN_TRANSFER_ERC_721,
        10,
        { next_page_params: null },
      ),
    },
  });

  const shouldFetchHolders = !tokenInstanceQuery.isPlaceholderData && tokenInstanceQuery.data && !tokenInstanceQuery.data.is_unique;

  const holdersQuery = useQueryWithPages({
    resourceName: 'token_instance_holders',
    pathParams: { hash, id },
    scrollRef,
    options: {
      enabled: Boolean(hash && tab === 'holders' && shouldFetchHolders),
      placeholderData: generateListStub<'token_instance_holders'>(tokenStubs.TOKEN_HOLDER, 10, { next_page_params: null }),
    },
  });

  React.useEffect(() => {
    if (tokenInstanceQuery.data && !tokenInstanceQuery.isPlaceholderData) {
      metadata.update(
        { pathname: '/token/[hash]/instance/[id]', query: { hash: tokenInstanceQuery.data.token.address, id: tokenInstanceQuery.data.id } },
        { symbol: tokenInstanceQuery.data.token.symbol ?? '' },
      );
    }
  }, [ tokenInstanceQuery.data, tokenInstanceQuery.isPlaceholderData ]);

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
      component: <TokenTransfer transfersQuery={ transfersQuery } tokenId={ id } token={ tokenInstanceQuery.data?.token }/>,
    },
    shouldFetchHolders ?
      { id: 'holders', title: 'Holders', component: <TokenHolders holdersQuery={ holdersQuery } token={ tokenInstanceQuery.data?.token }/> } :
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

  const nftShieldIcon = tokenInstanceQuery.isPlaceholderData ?
    <Skeleton boxSize={ 6 } display="inline-block" borderRadius="base" mr={ 2 } my={ 2 } verticalAlign="text-bottom"/> :
    <Icon as={ nftIcon } boxSize={ 6 } mr={ 2 }/>;
  const tokenTag = <Tag isLoading={ tokenInstanceQuery.isPlaceholderData }>{ tokenInstanceQuery.data?.token.type }</Tag>;
  const address = {
    hash: hash || '',
    is_contract: true,
    implementation_name: null,
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
        <Skeleton isLoaded={ !tokenInstanceQuery.isPlaceholderData } display="inline-block" fontSize="sm" mt={ 6 }>
          <span>View in app </span>
          <LinkExternal href={ url.toString() }>
            { url.hostname || tokenInstanceQuery.data.external_app_url }
          </LinkExternal>
        </Skeleton>
      );
    } catch (error) {
      return (
        <Box fontSize="sm" mt={ 6 }>
          <LinkExternal href={ tokenInstanceQuery.data.external_app_url }>
            View in app
          </LinkExternal>
        </Box>
      );
    }
  })();

  let pagination: PaginationParams | undefined;

  if (tab === 'token_transfers') {
    pagination = transfersQuery.pagination;
  } else if (tab === 'holders') {
    pagination = holdersQuery.pagination;
  }

  return (
    <>
      <PageTitle
        title={ `${ tokenInstanceQuery.data?.token.name || 'Unnamed token' } #${ tokenInstanceQuery.data?.id }` }
        backLink={ backLink }
        beforeTitle={ nftShieldIcon }
        contentAfter={ tokenTag }
        isLoading={ tokenInstanceQuery.isPlaceholderData }
      />

      <AddressHeadingInfo address={ address } token={ tokenInstanceQuery.data?.token } isLoading={ tokenInstanceQuery.isPlaceholderData }/>

      { appLink }

      <TokenInstanceDetails data={ tokenInstanceQuery?.data } isLoading={ tokenInstanceQuery.isPlaceholderData } scrollRef={ scrollRef }/>

      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>

      { tokenInstanceQuery.isPlaceholderData ? <TabsSkeleton tabs={ tabs }/> : (
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
