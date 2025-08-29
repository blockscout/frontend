import { Box, Flex, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { ZetaChainCCTXListResponse } from 'types/api/zetaChain';

import { route } from 'nextjs-routes';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useInitialList from 'lib/hooks/useInitialList';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { zetaChainCCTXItem } from 'mocks/zetaChain/zetaChainCCTX';
import { Link } from 'toolkit/chakra/link';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import ZetaChainCCTXListItem from 'ui/txs/zetaChain/ZetaChainCCTXListItem';

import LatestZetaChainCCTXItem from './LatestZetaChainCCTXItem';

const LatestZetahainCCTXs = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 3 : 8;
  const { data, isPlaceholderData, isError } = useApiQuery('zetachain:transactions', {
    queryOptions: {
      placeholderData: { items: Array(10).fill(zetaChainCCTXItem), next_page_params: { page_index: 0, offset: 0, direction: 'DESC' } },
    },
    queryParams: {
      // we request 10 items though we need less because socket sends 10 items at once
      limit: 10,
      offset: 0,
      direction: 'DESC',
    },
  });

  const initialList = useInitialList({
    data: data?.items ?? [],
    idFn: (tx) => tx.index,
    enabled: !isPlaceholderData,
  });

  const queryClient = useQueryClient();

  const channel = useSocketChannel({
    topic: 'cctxs:new_cctxs',
    isDisabled: Boolean(isPlaceholderData),
    socketName: 'zetachain',
  });

  const handleNewCCTXMessage: SocketMessage.NewZetaChainCCTXs['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(
      getResourceKey('zetachain:transactions', {
        queryParams: {
          limit: 10,
          offset: 0,
          direction: 'DESC',
        },
      }),
      (prevData: ZetaChainCCTXListResponse | undefined) => {
        if (!prevData) {
          return {
            items: payload,
            next_page_params: null,
          };
        }

        const existingItemsMap = new Map(
          prevData.items.map(item => [ item.index, item ]),
        );

        payload.forEach(newItem => {
          existingItemsMap.set(newItem.index, newItem);
        });

        const mergedItems = Array.from(existingItemsMap.values())
          .sort((a, b) => Number(b.last_update_timestamp) - Number(a.last_update_timestamp))
          .slice(0, 10);

        return {
          ...prevData,
          items: mergedItems,
        };
      },
    );
  }, [ queryClient ]);

  useSocketMessage({
    channel,
    event: 'new_cctxs',
    handler: handleNewCCTXMessage,
  });

  if (isError) {
    return <Text mt={ 4 }>No data. Please reload the page.</Text>;
  }

  if (data) {
    const cctxsUrl = route({ pathname: '/txs', query: { tab: 'cctx' } });
    return (
      <>
        <SocketNewItemsNotice
          type="cross_chain_transaction"
          isLoading={ isPlaceholderData }
        />
        <Box mb={ 3 } display={{ base: 'block', lg: 'none' }}>
          { data.items.slice(0, txsCount).map(((tx, index) => (
            <ZetaChainCCTXListItem
              key={ tx.index + (isPlaceholderData ? index : '') }
              tx={ tx }
              isLoading={ isPlaceholderData }
              animation={ initialList.getAnimationProp(tx) }
            />
          ))) }
        </Box>
        <AddressHighlightProvider>
          <Box mb={ 3 } display={{ base: 'none', lg: 'block' }}>
            { data.items.slice(0, txsCount).map(((tx, index) => (
              <LatestZetaChainCCTXItem
                key={ tx.index + (isPlaceholderData ? index : '') }
                tx={ tx }
                isLoading={ isPlaceholderData }
                animation={ initialList.getAnimationProp(tx) }
              />
            ))) }
          </Box>
        </AddressHighlightProvider>
        <Flex justifyContent="center">
          <Link textStyle="sm" href={ cctxsUrl }>View all cross chain transactions</Link>
        </Flex>
      </>
    );
  }

  return null;
};

export default LatestZetahainCCTXs;
