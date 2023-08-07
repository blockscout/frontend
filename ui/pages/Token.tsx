import { Box, Icon, Tooltip } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { TokenInfo } from 'types/api/token';
import type { PaginationParams } from 'ui/shared/pagination/types';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import appConfig from 'configs/app/config';
import iconSuccess from 'icons/status/success.svg';
import iconVerifiedToken from 'icons/verified_token.svg';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useContractTabs from 'lib/hooks/useContractTabs';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as metadata from 'lib/metadata';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
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
  const [ isQueryEnabled, setIsQueryEnabled ] = React.useState(false);
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
      enabled: isQueryEnabled && Boolean(router.query.hash),
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

  const enableQuery = React.useCallback(() => setIsQueryEnabled(true), []);

  const channel = useSocketChannel({
    topic: `tokens:${ hashString?.toLowerCase() }`,
    isDisabled: !hashString,
    onJoin: enableQuery,
    onSocketError: enableQuery,
  });
  useSocketMessage({
    channel,
    event: 'total_supply',
    handler: handleTotalSupplyMessage,
  });

  useEffect(() => {
    if (tokenQuery.data && !tokenQuery.isPlaceholderData) {
      metadata.update({ pathname: '/token/[hash]', query: { hash: tokenQuery.data.address } }, { symbol: tokenQuery.data.symbol ?? '' });
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
      component: <AddressContract tabs={ contractTabs }/>,
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

  const tokenSymbolText = tokenQuery.data?.symbol ? ` (${ tokenQuery.data.symbol })` : '';

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

  const titleContentAfter = (
    <>
      { verifiedInfoQuery.data?.tokenAddress && (
        <Tooltip label={ `Information on this token has been verified by ${ appConfig.network.name }` }>
          <Box boxSize={ 6 }>
            <Icon as={ iconVerifiedToken } color="green.500" boxSize={ 6 } cursor="pointer"/>
          </Box>
        </Tooltip>
      ) }
      <EntityTags
        data={ contractQuery.data }
        isLoading={ tokenQuery.isPlaceholderData || contractQuery.isPlaceholderData }
        tagsBefore={ [
          tokenQuery.data ? { label: tokenQuery.data?.type, display_name: tokenQuery.data?.type } : undefined,
        ] }
        tagsAfter={
          verifiedInfoQuery.data?.projectSector ?
            [ { label: verifiedInfoQuery.data.projectSector, display_name: verifiedInfoQuery.data.projectSector } ] :
            undefined
        }
        contentAfter={
          <NetworkExplorers type="token" pathParam={ hashString } ml="auto" hideText={ isMobile }/>
        }
        flexGrow={ 1 }
      />
    </>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `${ tokenQuery.data?.name || 'Unnamed token' }${ tokenSymbolText }` }
        isLoading={ tokenQuery.isPlaceholderData }
        backLink={ backLink }
        beforeTitle={ (
          <TokenLogo
            data={ tokenQuery.data }
            boxSize={ 6 }
            isLoading={ tokenQuery.isPlaceholderData }
            mr={ 2 }
          />
        ) }
        contentAfter={ titleContentAfter }
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
