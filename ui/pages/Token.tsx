import { Box, Icon } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { TokenInfo } from 'types/api/token';
import type { PaginationParams } from 'ui/shared/pagination/types';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import appConfig from 'configs/app/config';
import iconSuccess from 'icons/status/success.svg';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useContractTabs from 'lib/hooks/useContractTabs';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import trimTokenSymbol from 'lib/token/trimTokenSymbol';
import * as addressStubs from 'stubs/address';
import * as tokenStubs from 'stubs/token';
import { generateListStub } from 'stubs/utils';
import AddressContract from 'ui/address/AddressContract';
import TextAd from 'ui/shared/ad/TextAd';
import EntityTags from 'ui/shared/EntityTags';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import TokenLogo from 'ui/shared/TokenLogo';
import TokenContractInfo from 'ui/token/TokenContractInfo';
import TokenDetails from 'ui/token/TokenDetails';
import TokenHolders from 'ui/token/TokenHolders/TokenHolders';
import TokenInventory from 'ui/token/TokenInventory';
import TokenTransfer from 'ui/token/TokenTransfer/TokenTransfer';
import TokenVerifiedInfo from 'ui/token/TokenVerifiedInfo';

export type TokenTabs = 'token_transfers' | 'holders' | 'inventory';

const TokenPageContent = () => {
  const [ isSocketOpen, setIsSocketOpen ] = React.useState(false);
  const [ totalSupplySocket, setTotalSupplySocket ] = React.useState<number>();
  const router = useRouter();
  const isMobile = useIsMobile();

  const appProps = useAppContext();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const hashString = getQueryParamString(router.query.hash);

  const queryClient = useQueryClient();

  const tokenQuery = useApiQuery('token', {
    pathParams: { hash: hashString },
    queryOptions: {
      enabled: Boolean(router.query.hash),
      placeholderData: tokenStubs.TOKEN_INFO_ERC_20,
    },
  });

  const contractQuery = useApiQuery('address', {
    pathParams: { hash: hashString },
    queryOptions: {
      enabled: isSocketOpen && Boolean(router.query.hash),
      placeholderData: addressStubs.ADDRESS_INFO,
    },
  });

  React.useEffect(() => {
    if (tokenQuery.data && totalSupplySocket) {
      queryClient.setQueryData(getResourceKey('token', { pathParams: { hash: hashString } }), (prevData: TokenInfo | undefined) => {
        if (prevData) {
          return { ...prevData, total_supply: totalSupplySocket.toString() };
        }
      });
    }
  }, [ tokenQuery.data, totalSupplySocket, hashString, queryClient ]);

  const handleTotalSupplyMessage: SocketMessage.TokenTotalSupply['handler'] = React.useCallback((payload) => {
    const prevData = queryClient.getQueryData(getResourceKey('token', { pathParams: { hash: hashString } }));
    if (!prevData) {
      setTotalSupplySocket(payload.total_supply);
    }
    queryClient.setQueryData(getResourceKey('token', { pathParams: { hash: hashString } }), (prevData: TokenInfo | undefined) => {
      if (prevData) {
        return { ...prevData, total_supply: payload.total_supply.toString() };
      }
    });
  }, [ queryClient, hashString ]);

  const channel = useSocketChannel({
    topic: `tokens:${ hashString?.toLowerCase() }`,
    isDisabled: !hashString,
    onJoin: () => setIsSocketOpen(true),
  });
  useSocketMessage({
    channel,
    event: 'total_supply',
    handler: handleTotalSupplyMessage,
  });

  useEffect(() => {
    if (tokenQuery.data && !tokenQuery.isPlaceholderData) {
      const tokenSymbol = tokenQuery.data.symbol ? ` (${ tokenQuery.data.symbol })` : '';
      const tokenName = `${ tokenQuery.data.name || 'Unnamed' }${ tokenSymbol }`;
      const title = document.getElementsByTagName('title')[0];
      if (title) {
        title.textContent = title.textContent?.replace(tokenQuery.data.address, tokenName) || title.textContent;
      }
      const description = document.getElementsByName('description')[0] as HTMLMetaElement;
      if (description) {
        description.content = description.content.replace(tokenQuery.data.address, tokenName) || description.content;
      }
    }
  }, [ tokenQuery.data, tokenQuery.isPlaceholderData ]);

  const hasData = (tokenQuery.data && !tokenQuery.isPlaceholderData) && (contractQuery.data && !contractQuery.isPlaceholderData);

  const transfersQuery = useQueryWithPages({
    resourceName: 'token_transfers',
    pathParams: { hash: hashString },
    scrollRef,
    options: {
      enabled: Boolean(hashString && (!router.query.tab || router.query.tab === 'token_transfers') && hasData),
      placeholderData: tokenStubs.getTokenTransfersStub(tokenQuery.data?.type),
    },
  });

  const holdersQuery = useQueryWithPages({
    resourceName: 'token_holders',
    pathParams: { hash: hashString },
    scrollRef,
    options: {
      enabled: Boolean(router.query.hash && router.query.tab === 'holders' && hasData),
      placeholderData: generateListStub<'token_holders'>(tokenStubs.TOKEN_HOLDER, 50, { next_page_params: null }),
    },
  });

  const inventoryQuery = useQueryWithPages({
    resourceName: 'token_inventory',
    pathParams: { hash: hashString },
    scrollRef,
    options: {
      enabled: Boolean(router.query.hash && router.query.tab === 'inventory' && hasData),
      placeholderData: generateListStub<'token_inventory'>(tokenStubs.TOKEN_INSTANCE, 50, { next_page_params: null }),
    },
  });

  const isVerifiedInfoEnabled = Boolean(appConfig.contractInfoApi.endpoint);
  const verifiedInfoQuery = useApiQuery('token_verified_info', {
    pathParams: { hash: hashString, chainId: appConfig.network.id },
    queryOptions: { enabled: Boolean(tokenQuery.data) && isVerifiedInfoEnabled },
  });

  const contractTabs = useContractTabs(contractQuery.data);

  const tabs: Array<RoutedTab> = [
    { id: 'token_transfers', title: 'Token transfers', component: <TokenTransfer transfersQuery={ transfersQuery } token={ tokenQuery.data }/> },
    { id: 'holders', title: 'Holders', component: <TokenHolders token={ tokenQuery.data } holdersQuery={ holdersQuery }/> },
    (tokenQuery.data?.type === 'ERC-1155' || tokenQuery.data?.type === 'ERC-721') ?
      { id: 'inventory', title: 'Inventory', component: <TokenInventory inventoryQuery={ inventoryQuery }/> } :
      undefined,
    contractQuery.data?.is_contract ? {
      id: 'contract',
      title: () => {
        if (contractQuery.data?.is_verified) {
          return (
            <>
              <span>Contract</span>
              <Icon as={ iconSuccess } boxSize="14px" color="green.500" ml={ 1 }/>
            </>
          );
        }

        return 'Contract';
      },
      component: <AddressContract tabs={ contractTabs } addressHash={ hashString }/>,
      subTabs: contractTabs.map(tab => tab.id),
    } : undefined,
  ].filter(Boolean);

  let pagination: PaginationParams | undefined;

  if (!router.query.tab || router.query.tab === 'token_transfers') {
    pagination = transfersQuery.pagination;
  }

  if (router.query.tab === 'holders') {
    pagination = holdersQuery.pagination;
  }

  if (router.query.tab === 'inventory') {
    pagination = inventoryQuery.pagination;
  }

  const tokenSymbolText = tokenQuery.data?.symbol ? ` (${ trimTokenSymbol(tokenQuery.data.symbol) })` : '';

  const tabListProps = React.useCallback(({ isSticky, activeTabIndex }: { isSticky: boolean; activeTabIndex: number }) => {
    if (isMobile) {
      return { mt: 8 };
    }

    return {
      mt: 3,
      py: 5,
      marginBottom: 0,
      boxShadow: activeTabIndex === 2 && isSticky ? 'action_bar' : 'none',
    };
  }, [ isMobile ]);

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/tokens');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to tokens list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const tags = (
    <EntityTags
      data={ contractQuery.data }
      isLoading={ tokenQuery.isPlaceholderData || contractQuery.isPlaceholderData }
      tagsBefore={ [
        tokenQuery.data ? { label: tokenQuery.data?.type, display_name: tokenQuery.data?.type } : undefined,
      ] }
      contentAfter={
        <NetworkExplorers type="token" pathParam={ hashString } ml="auto" hideText={ isMobile }/>
      }
      flexGrow={ 1 }
    />
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `${ tokenQuery.data?.name || 'Unnamed' }${ tokenSymbolText } token` }
        isLoading={ tokenQuery.isPlaceholderData }
        backLink={ backLink }
        beforeTitle={ (
          <TokenLogo
            data={ tokenQuery.data }
            boxSize={ 6 }
            isLoading={ tokenQuery.isPlaceholderData }
            display="inline-block"
            mr={ 2 }
            my={{ base: 'auto', lg: tokenQuery.isPlaceholderData ? 2 : 'auto' }}
            verticalAlign={{ base: undefined, lg: tokenQuery.isPlaceholderData ? 'text-bottom' : undefined }}
          />
        ) }
        afterTitle={
          verifiedInfoQuery.data?.tokenAddress ?
            <Icon as={ iconSuccess } color="green.500" boxSize={ 4 } verticalAlign="top"/> :
            <Box boxSize={ 4 } display="inline-block"/>
        }
        contentAfter={ tags }
      />
      <TokenContractInfo tokenQuery={ tokenQuery } contractQuery={ contractQuery }/>
      <TokenVerifiedInfo verifiedInfoQuery={ verifiedInfoQuery } isVerifiedInfoEnabled={ isVerifiedInfoEnabled }/>
      <TokenDetails tokenQuery={ tokenQuery }/>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>

      { tokenQuery.isPlaceholderData || contractQuery.isPlaceholderData ?
        <TabsSkeleton tabs={ tabs }/> :
        (
          <RoutedTabs
            tabs={ tabs }
            tabListProps={ tabListProps }
            rightSlot={ !isMobile && pagination?.isVisible ? <Pagination { ...pagination }/> : null }
            stickyEnabled={ !isMobile }
          />
        ) }
    </>
  );
};

export default TokenPageContent;
