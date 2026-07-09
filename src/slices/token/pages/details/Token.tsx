// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { schemas } from '@blockscout/api-types';
import type { SocketMessage } from 'src/api/socket/types';
import { NFT_TOKEN_TYPE_IDS } from 'src/slices/token/utils/token-types';
import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import useApiQuery, { getResourceKey } from 'src/api/hooks/useApiQuery';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import * as metadata from 'src/shell/metadata';

import * as addressStubs from 'src/slices/address/stubs/address';
import Contract from 'src/slices/contract/pages/details/Contract';
import { CONTRACT_TAB_IDS } from 'src/slices/contract/utils/tabs';
import TokenTransfer from 'src/slices/token-transfer/pages/token/TokenTransfer';
import useTokenQuery from 'src/slices/token/hooks/useTokenQuery';
import TokenHolders from 'src/slices/token/pages/details/holders/TokenHolders';
import TokenDetails from 'src/slices/token/pages/details/info/TokenDetails';
import TokenInventory from 'src/slices/token/pages/details/inventory/TokenInventory';
import TokenPageTitle from 'src/slices/token/pages/details/TokenPageTitle';
import { TOKEN_COUNTERS } from 'src/slices/token/stubs';

import Address3rdPartyWidgets from 'src/features/address-3rd-party-widgets/pages/address/Address3rdPartyWidgets';
import useAddress3rdPartyWidgets from 'src/features/address-3rd-party-widgets/pages/address/useAddress3rdPartyWidgets';
import TextAd from 'src/features/ads/text/components/TextAd';

import config from 'src/config';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import useEtherscanRedirects from 'src/shared/router/useEtherscanRedirects';
import SpriteIcon from 'src/sprite/SpriteIcon';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

export type TokenTabs = 'token_transfers' | 'holders' | 'inventory';

const TokenPageContent = () => {
  const [ isQueryEnabled, setIsQueryEnabled ] = React.useState(false);
  const [ totalSupplySocket, setTotalSupplySocket ] = React.useState<number>();
  const router = useRouter();

  const hashString = getQueryParamString(router.query.hash);
  const ownerFilter = getQueryParamString(router.query.holder_address_hash) || undefined;

  useEtherscanRedirects();
  const queryClient = useQueryClient();

  const tokenQuery = useTokenQuery(hashString);

  const addressQuery = useApiQuery('core:address', {
    pathParams: { hash: hashString },
    queryOptions: {
      enabled: isQueryEnabled && Boolean(router.query.hash),
      placeholderData: addressStubs.ADDRESS_INFO,
    },
  });

  React.useEffect(() => {
    if (tokenQuery.data && totalSupplySocket) {
      queryClient.setQueryData(getResourceKey('core:token', { pathParams: { hash: hashString } }), (prevData: schemas['Token'] | undefined) => {
        if (prevData) {
          return { ...prevData, total_supply: totalSupplySocket.toString() };
        }
      });
    }
  }, [ tokenQuery.data, totalSupplySocket, hashString, queryClient ]);

  const handleTotalSupplyMessage: SocketMessage.TokenTotalSupply['handler'] = React.useCallback((payload) => {
    const prevData = queryClient.getQueryData(getResourceKey('core:token', { pathParams: { hash: hashString } }));
    if (!prevData) {
      setTotalSupplySocket(payload.total_supply);
    }
    queryClient.setQueryData(getResourceKey('core:token', { pathParams: { hash: hashString } }), (prevData: schemas['Token'] | undefined) => {
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

  const verifiedInfoQuery = useApiQuery('contractInfo:token_verified_info', {
    pathParams: { hash: tokenQuery.data?.address_hash, instanceId: config.apis.contractInfo?.instanceId },
    queryOptions: { enabled: Boolean(tokenQuery.data) && !tokenQuery.isPlaceholderData && config.features.verifiedTokens.isEnabled },
  });

  useEffect(() => {
    // even if config.metadata.seo.enhancedDataEnabled is enabled, we don't fetch contract info for the project description
    // so we need to update the metadata anyway.
    if (tokenQuery.data && !tokenQuery.isPlaceholderData && !verifiedInfoQuery.isPlaceholderData) {
      const apiData = {
        ...tokenQuery.data,
        symbol_or_name: tokenQuery.data.symbol ?? tokenQuery.data.name ?? '',
        description: verifiedInfoQuery.data?.projectDescription,
        projectName: verifiedInfoQuery.data?.projectName,
      };
      metadata.update({ pathname: '/token/[hash]', query: { hash: tokenQuery.data.address_hash } }, apiData);
    }
  }, [ tokenQuery.data, tokenQuery.isPlaceholderData, verifiedInfoQuery.isPlaceholderData, verifiedInfoQuery.data ]);

  const hasInventoryTab = tokenQuery.data?.type && NFT_TOKEN_TYPE_IDS.includes(tokenQuery.data.type);

  const tokenCountersQuery = useApiQuery('core:token_counters', {
    pathParams: { hash: hashString },
    queryOptions: { enabled: Boolean(hashString), placeholderData: TOKEN_COUNTERS },
  });

  const address3rdPartyWidgets = useAddress3rdPartyWidgets('token', false, isQueryEnabled);

  throwOnResourceLoadError(tokenQuery);

  const isMainDataLoading = tokenQuery.isPlaceholderData || addressQuery.isPlaceholderData;
  const isFullDataLoading = isMainDataLoading || (address3rdPartyWidgets.isEnabled && address3rdPartyWidgets.configQuery.isPlaceholderData);

  const transfersCount = !tokenCountersQuery.isPlaceholderData && tokenCountersQuery.data?.transfers_count ?
    Number(tokenCountersQuery.data.transfers_count) :
    undefined;
  const holdersCount = !tokenCountersQuery.isPlaceholderData && tokenCountersQuery.data?.token_holders_count ?
    Number(tokenCountersQuery.data.token_holders_count) :
    undefined;

  const tabs: Array<TabItemRegular> = [
    {
      id: 'index',
      title: 'Details',
      component: (
        <TokenDetails
          data={ tokenQuery.data }
          counters={ tokenCountersQuery.data }
          isLoading={ isMainDataLoading }
          isLoadingCounters={ tokenCountersQuery.isPlaceholderData }
          address3rdPartyWidgets={ address3rdPartyWidgets.items }
        />
      ),
    },
    addressQuery.data?.is_contract ? {
      id: 'contract',
      title: () => {
        if (addressQuery.data?.is_verified) {
          return (
            <>
              <span>Contract</span>
              <SpriteIcon name="status/success" boxSize="14px" color="green.500"/>
            </>
          );
        }

        return 'Contract';
      },
      component: <Contract addressData={ addressQuery.data } isLoading={ isMainDataLoading }/>,
      subTabs: CONTRACT_TAB_IDS,
    } : undefined,
    hasInventoryTab ? {
      id: 'inventory',
      title: 'Inventory',
      component: <TokenInventory hash={ hashString } token={ tokenQuery.data } isLoading={ isMainDataLoading } ownerFilter={ ownerFilter }/>,
    } : undefined,
    {
      id: 'token_transfers',
      title: 'Token transfers',
      count: transfersCount,
      component: <TokenTransfer token={ tokenQuery.data } isLoading={ isMainDataLoading }/>,
    },
    {
      id: 'holders',
      title: 'Holders',
      count: holdersCount,
      component: <TokenHolders token={ tokenQuery.data } isLoading={ isMainDataLoading }/>,
    },
    (address3rdPartyWidgets.isEnabled && address3rdPartyWidgets.items.length > 0) ? {
      id: 'widgets',
      title: 'Widgets',
      count: address3rdPartyWidgets.items.length,
      component: <Address3rdPartyWidgets shouldRender={ !isFullDataLoading } addressType="token" showAll/>,
    } : undefined,
  ].filter(Boolean);

  return (
    <>
      <TextAd mb={ 6 }/>

      <TokenPageTitle
        tokenQuery={ tokenQuery }
        addressQuery={ addressQuery }
        verifiedInfoQuery={ verifiedInfoQuery }
        hash={ hashString }
      />

      <RoutedTabs
        tabs={ tabs }
        isLoading={ isFullDataLoading }
      />
    </>
  );
};

export default TokenPageContent;
