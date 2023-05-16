import { Box, Tag, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import nftIcon from 'icons/nft_shield.svg';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/appContext';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import TextAd from 'ui/shared/ad/TextAd';
import AddressHeadingInfo from 'ui/shared/AddressHeadingInfo';
import LinkExternal from 'ui/shared/LinkExternal';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import SkeletonTabs from 'ui/shared/skeletons/SkeletonTabs';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TokenHolders from 'ui/token/TokenHolders/TokenHolders';
import TokenTransfer from 'ui/token/TokenTransfer/TokenTransfer';

import TokenInstanceDetails from './TokenInstanceDetails';
import TokenInstanceMetadata from './TokenInstanceMetadata';
import TokenInstanceSkeleton from './TokenInstanceSkeleton';

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
    queryOptions: { enabled: Boolean(hash && id) },
  });

  const transfersQuery = useQueryWithPages({
    resourceName: 'token_instance_transfers',
    pathParams: { hash, id },
    scrollRef,
    options: {
      enabled: Boolean(hash && (!tab || tab === 'token_transfers') && tokenInstanceQuery.data),
    },
  });

  const shouldFetchHolders = tokenInstanceQuery.data && !tokenInstanceQuery.data.is_unique;

  const holdersQuery = useQueryWithPages({
    resourceName: 'token_instance_holders',
    pathParams: { hash, id },
    scrollRef,
    options: {
      enabled: Boolean(hash && (!tab || tab === 'holders') && shouldFetchHolders),
    },
  });

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
    { id: 'metadata', title: 'Metadata', component: <TokenInstanceMetadata data={ tokenInstanceQuery.data?.metadata }/> },
  ].filter(Boolean);

  if (tokenInstanceQuery.isError) {
    throw Error('Token instance fetch failed', { cause: tokenInstanceQuery.error });
  }

  if (tokenInstanceQuery.isLoading) {
    return <TokenInstanceSkeleton/>;
  }

  const nftShieldIcon = <Icon as={ nftIcon } boxSize={ 6 }/>;
  const tokenTag = <Tag>{ tokenInstanceQuery.data.token.type }</Tag>;
  const address = {
    hash: hash || '',
    is_contract: true,
    implementation_name: null,
    watchlist_names: [],
    watchlist_address_id: null,
  };
  const appLink = (() => {
    if (!tokenInstanceQuery.data.external_app_url) {
      return null;
    }

    try {
      const url = new URL(tokenInstanceQuery.data.external_app_url);
      return (
        <Box fontSize="sm" mt={ 6 }>
          <span>View in app </span>
          <LinkExternal href={ tokenInstanceQuery.data.external_app_url }>
            { url.hostname }
          </LinkExternal>
        </Box>
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

  let pagination: PaginationProps | undefined;
  let isPaginationVisible;

  if (tab === 'token_transfers') {
    pagination = transfersQuery.pagination;
    isPaginationVisible = transfersQuery.isPaginationVisible;
  } else if (tab === 'holders') {
    pagination = holdersQuery.pagination;
    isPaginationVisible = holdersQuery.isPaginationVisible;
  }

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        text={ `${ tokenInstanceQuery.data.token.name || 'Unnamed token' } #${ tokenInstanceQuery.data.id }` }
        backLink={ backLink }
        additionalsLeft={ nftShieldIcon }
        additionalsRight={ tokenTag }
      />

      <AddressHeadingInfo address={ address } token={ tokenInstanceQuery.data.token }/>

      { appLink }

      <TokenInstanceDetails data={ tokenInstanceQuery.data } scrollRef={ scrollRef }/>

      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>

      { tokenInstanceQuery.isLoading ? <SkeletonTabs/> : (
        <RoutedTabs
          tabs={ tabs }
          tabListProps={ isMobile ? { mt: 8 } : { mt: 3, py: 5, marginBottom: 0 } }
          rightSlot={ !isMobile && isPaginationVisible && pagination ? <Pagination { ...pagination }/> : null }
          stickyEnabled={ !isMobile }
        />
      ) }

      { !tokenInstanceQuery.isLoading && !tokenInstanceQuery.isError && <Box h={{ base: 0, lg: '40vh' }}/> }
    </>
  );
};

export default React.memo(TokenInstanceContent);
