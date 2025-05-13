import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { AddressTokenBalance, AddressTokensBalancesSocketMessage, AddressTokensResponse } from 'types/api/address';
import type { TokenType } from 'types/api/token';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

import { calculateUsdValue } from './tokenUtils';
interface Props {
  hash?: string;
  enabled?: boolean;
}

const tokenBalanceItemIdentityFactory = (match: AddressTokenBalance) => (item: AddressTokenBalance) => ((
  match.token.address_hash === item.token.address_hash &&
  match.token_id === item.token_id &&
  match.token_instance?.id === item.token_instance?.id
));

export default function useFetchTokens({ hash, enabled }: Props) {
  const erc20query = useApiQuery('general:address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-20' },
    queryOptions: { enabled: Boolean(hash) && enabled, refetchOnMount: false },
  });
  const erc721query = useApiQuery('general:address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-721' },
    queryOptions: { enabled: Boolean(hash) && enabled, refetchOnMount: false },
  });
  const erc1155query = useApiQuery('general:address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-1155' },
    queryOptions: { enabled: Boolean(hash) && enabled, refetchOnMount: false },
  });
  const erc404query = useApiQuery('general:address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-404' },
    queryOptions: { enabled: Boolean(hash) && enabled, refetchOnMount: false },
  });

  const queryClient = useQueryClient();

  const updateTokensData = React.useCallback((type: TokenType, payload: AddressTokensBalancesSocketMessage) => {
    const queryKey = getResourceKey('general:address_tokens', { pathParams: { hash }, queryParams: { type } });

    queryClient.setQueryData(queryKey, (prevData: AddressTokensResponse | undefined) => {
      const items = prevData?.items.map((currentItem) => {
        const updatedData = payload.token_balances.find(tokenBalanceItemIdentityFactory(currentItem));
        return updatedData ?? currentItem;
      }) || [];

      const extraItems = prevData?.next_page_params ?
        [] :
        payload.token_balances.filter((socketItem) => !items.some(tokenBalanceItemIdentityFactory(socketItem)));

      if (!prevData) {
        return {
          items: extraItems,
          next_page_params: null,
        };
      }

      return {
        items: items.concat(extraItems),
        next_page_params: prevData.next_page_params,
      };
    });
  }, [ hash, queryClient ]);

  const handleTokenBalancesErc20Message: SocketMessage.AddressTokenBalancesErc20['handler'] = React.useCallback((payload) => {
    updateTokensData('ERC-20', payload);
  }, [ updateTokensData ]);

  const handleTokenBalancesErc721Message: SocketMessage.AddressTokenBalancesErc721['handler'] = React.useCallback((payload) => {
    updateTokensData('ERC-721', payload);
  }, [ updateTokensData ]);

  const handleTokenBalancesErc1155Message: SocketMessage.AddressTokenBalancesErc1155['handler'] = React.useCallback((payload) => {
    updateTokensData('ERC-1155', payload);
  }, [ updateTokensData ]);

  const handleTokenBalancesErc404Message: SocketMessage.AddressTokenBalancesErc1155['handler'] = React.useCallback((payload) => {
    updateTokensData('ERC-404', payload);
  }, [ updateTokensData ]);

  const channel = useSocketChannel({
    topic: `addresses:${ hash?.toLowerCase() }`,
    isDisabled: Boolean(hash) && (erc20query.isPlaceholderData || erc721query.isPlaceholderData || erc1155query.isPlaceholderData),
  });

  useSocketMessage({
    channel,
    event: 'updated_token_balances_erc_20',
    handler: handleTokenBalancesErc20Message,
  });
  useSocketMessage({
    channel,
    event: 'updated_token_balances_erc_721',
    handler: handleTokenBalancesErc721Message,
  });
  useSocketMessage({
    channel,
    event: 'updated_token_balances_erc_1155',
    handler: handleTokenBalancesErc1155Message,
  });
  useSocketMessage({
    channel,
    event: 'updated_token_balances_erc_404',
    handler: handleTokenBalancesErc404Message,
  });

  const data = React.useMemo(() => {
    return {
      'ERC-20': {
        items: erc20query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc20query.data?.next_page_params),
      },
      'ERC-721': {
        items: erc721query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc721query.data?.next_page_params),
      },
      'ERC-1155': {
        items: erc1155query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc1155query.data?.next_page_params),
      },
      'ERC-404': {
        items: erc404query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc1155query.data?.next_page_params),
      },
    };
  }, [ erc1155query.data, erc20query.data, erc721query.data, erc404query.data ]);

  return {
    isPending: erc20query.isPending || erc721query.isPending || erc1155query.isPending || erc404query.isPending,
    isError: erc20query.isError || erc721query.isError || erc1155query.isError || erc404query.isError,
    data,
  };
}
