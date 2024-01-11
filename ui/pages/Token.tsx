import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { TokenInfo } from 'types/api/token';
import type { PaginationParams } from 'ui/shared/pagination/types';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
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
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import TextAd from 'ui/shared/ad/TextAd';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import EntityTags from 'ui/shared/EntityTags';
import IconSvg from 'ui/shared/IconSvg';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
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
  const tab = getQueryParamString(router.query.tab);
  const ownerFilter = getQueryParamString(router.query.holder_address_hash) || undefined;

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
  const hasInventoryTab = tokenQuery.data?.type === 'ERC-1155' || tokenQuery.data?.type === 'ERC-721';

  const transfersQuery = useQueryWithPages({
    resourceName: 'token_transfers',
    pathParams: { hash: hashString },
    scrollRef,
    options: {
      enabled: Boolean(
        hasData &&
        hashString &&
        (
          (!hasInventoryTab && !tab) ||
          tab === 'token_transfers'
        ),
      ),
      placeholderData: tokenStubs.getTokenTransfersStub(tokenQuery.data?.type),
    },
  });

  const inventoryQuery = useQueryWithPages({
    resourceName: 'token_inventory',
    pathParams: { hash: hashString },
    filters: ownerFilter ? { holder_address_hash: ownerFilter } : {},
    scrollRef,
    options: {
      enabled: Boolean(
        hasData &&
        hashString &&
        (
          (hasInventoryTab && !tab) ||
          tab === 'inventory'
        ),
      ),
      placeholderData: generateListStub<'token_inventory'>(tokenStubs.TOKEN_INSTANCE, 50, { next_page_params: { unique_token: 1 } }),
    },
  });

  const holdersQuery = useQueryWithPages({
    resourceName: 'token_holders',
    pathParams: { hash: hashString },
    scrollRef,
    options: {
      enabled: Boolean(hashString && tab === 'holders' && hasData),
      placeholderData: generateListStub<'token_holders'>(
        tokenQuery.data?.type === 'ERC-1155' ? tokenStubs.TOKEN_HOLDER_ERC_1155 : tokenStubs.TOKEN_HOLDER_ERC_20, 50, { next_page_params: null }),
    },
  });

  const verifiedInfoQuery = useApiQuery('token_verified_info', {
    pathParams: { hash: hashString, chainId: config.chain.id },
    queryOptions: { enabled: Boolean(tokenQuery.data) && config.features.verifiedTokens.isEnabled },
  });

  const contractTabs = useContractTabs(contractQuery.data);

  const tabs: Array<RoutedTab> = [
    (tokenQuery.data?.type === 'ERC-1155' || tokenQuery.data?.type === 'ERC-721') ? {
      id: 'inventory',
      title: 'Inventory',
      component: <TokenInventory inventoryQuery={ inventoryQuery } tokenQuery={ tokenQuery } ownerFilter={ ownerFilter }/>,
    } : undefined,
    { id: 'token_transfers', title: 'Token transfers', component: <TokenTransfer transfersQuery={ transfersQuery } token={ tokenQuery.data }/> },
    { id: 'holders', title: 'Holders', component: <TokenHolders token={ tokenQuery.data } holdersQuery={ holdersQuery }/> },
    contractQuery.data?.is_contract ? {
      id: 'contract',
      title: () => {
        if (contractQuery.data?.is_verified) {
          return (
            <>
              <span>Contract</span>
              <IconSvg name="status/success" boxSize="14px" color="green.500" ml={ 1 }/>
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

  // default tab for erc-20 is token transfers
  if ((tokenQuery.data?.type === 'ERC-20' && !tab) || tab === 'token_transfers') {
    pagination = transfersQuery.pagination;
  }

  if (router.query.tab === 'holders') {
    pagination = holdersQuery.pagination;
  }

  // default tab for nfts is token inventory
  if (((tokenQuery.data?.type === 'ERC-1155' || tokenQuery.data?.type === 'ERC-721') && !tab) || tab === 'inventory') {
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
        <Tooltip label={ `Information on this token has been verified by ${ config.chain.name }` }>
          <Box boxSize={ 6 }>
            <IconSvg name="verified_token" color="green.500" boxSize={ 6 } cursor="pointer"/>
          </Box>
        </Tooltip>
      ) }
      <EntityTags
        data={ contractQuery.data }
        isLoading={ tokenQuery.isPlaceholderData || contractQuery.isPlaceholderData }
        tagsBefore={ [
          tokenQuery.data ? { label: tokenQuery.data?.type, display_name: tokenQuery.data?.type } : undefined,
          config.features.bridgedTokens.isEnabled && tokenQuery.data?.is_bridged ?
            { label: 'bridged', display_name: 'Bridged', colorScheme: 'blue', variant: 'solid' } :
            undefined,
        ] }
        tagsAfter={
          verifiedInfoQuery.data?.projectSector ?
            [ { label: verifiedInfoQuery.data.projectSector, display_name: verifiedInfoQuery.data.projectSector } ] :
            undefined
        }
        flexGrow={ 1 }
      />
    </>
  );

  const isLoading = tokenQuery.isPlaceholderData || contractQuery.isPlaceholderData;

  const titleSecondRow = (
    <Flex alignItems="center" w="100%" minW={ 0 } columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      <AddressEntity
        address={{ ...contractQuery.data, name: '' }}
        isLoading={ isLoading }
        fontFamily="heading"
        fontSize="lg"
        fontWeight={ 500 }
      />
      { !isLoading && tokenQuery.data && <AddressAddToWallet token={ tokenQuery.data } variant="button"/> }
      <AddressQrCode address={ contractQuery.data } isLoading={ isLoading }/>
      <AccountActionsMenu isLoading={ isLoading }/>
      <Flex ml={{ base: 0, lg: 'auto' }} columnGap={ 2 } flexGrow={{ base: 1, lg: 0 }}>
        <TokenVerifiedInfo verifiedInfoQuery={ verifiedInfoQuery }/>
        <NetworkExplorers type="token" pathParam={ hashString } ml={{ base: 'auto', lg: 0 }}/>
      </Flex>
    </Flex>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `${ tokenQuery.data?.name || 'Unnamed token' }${ tokenSymbolText }` }
        isLoading={ isLoading }
        backLink={ backLink }
        beforeTitle={ tokenQuery.data ? (
          <TokenEntity.Icon
            token={ tokenQuery.data }
            isLoading={ isLoading }
            iconSize="lg"
          />
        ) : null }
        contentAfter={ titleContentAfter }
        secondRow={ titleSecondRow }
      />

      <TokenDetails tokenQuery={ tokenQuery }/>

      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>

      { isLoading ?
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
