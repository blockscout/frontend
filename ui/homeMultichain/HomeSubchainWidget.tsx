import { Box, HStack, VStack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { SubchainConfig } from 'types/multichain';

import { route } from 'nextjs-routes';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { BLOCK } from 'stubs/block';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Heading } from 'toolkit/chakra/heading';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import GasPrice from 'ui/shared/gas/GasPrice';
import IconSvg from 'ui/shared/IconSvg';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

interface Props {
  data: SubchainConfig;
}

const HomeSubchainWidget = ({ data }: Props) => {
  const queryClient = useQueryClient();

  const blocksQuery = useApiQuery('general:homepage_blocks', {
    subchainId: data.slug,
    queryOptions: {
      placeholderData: [ BLOCK ],
    },
  });

  const statsQuery = useApiQuery('general:stats', {
    subchainId: data.slug,
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    const queryKey = getResourceKey('general:homepage_blocks', { subchainId: data.slug });
    queryClient.setQueryData(queryKey, () => {
      return [ payload.block ];
    });
  }, [ queryClient, data.slug ]);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
    isDisabled: blocksQuery.isPlaceholderData || blocksQuery.isError,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  return (
    <Box
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
      borderRadius="xl"
      border="1px solid"
      borderColor={{ _light: 'gray.200', _dark: 'gray.900' }}
      p={ 4 }
      flexBasis="50%"
      textStyle="sm"
    >
      <HStack justifyContent="space-between">
        <Image src={ data.config.UI.navigation.icon.default } alt={ data.config.chain.name } boxSize="30px" borderRadius="full"/>
        <Link
          href={ data.config.app.baseUrl }
          target="_blank"
          p={ 1 }
          color="gray.500"
          _hover={{
            color: 'link.primary.hover',
          }}
          bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
          borderRadius="base"
        >
          <IconSvg name="globe" boxSize={ 6 }/>
        </Link>
      </HStack>
      <Heading mt={ 3 } level="3">{ data.config.chain.name }</Heading>
      <VStack gap={ 2 } mt={ 3 } alignItems="flex-start">
        <HStack gap={ 2 }>
          <Box color="text.secondary">Chain ID</Box>
          <Box>{ data.config.chain.id }</Box>
          <CopyToClipboard text={ String(data.config.chain.id) } ml={ 0 }/>
        </HStack>
        { /* TODO @tom2drum move to a separate component as it re-renders too often */ }
        { blocksQuery.data?.[0] && (
          <HStack gap={ 2 }>
            <Box color="text.secondary">Latest block</Box>
            <Link
              loading={ blocksQuery.isPlaceholderData }
              href={ route({
                pathname: '/subchain/[subchain-id]/block/[height_or_hash]',
                query: {
                  'subchain-id': data.slug,
                  height_or_hash: blocksQuery.data[0].height.toString(),
                },
              }) }
            >
              { blocksQuery.data[0].height }
            </Link>
            <TimeWithTooltip
              timestamp={ blocksQuery.data[0].timestamp }
              enableIncrement={ !blocksQuery.isPlaceholderData }
              isLoading={ blocksQuery.isPlaceholderData }
              color="text.secondary"
              flexShrink={ 0 }
              timeFormat="relative"
            />
          </HStack>
        ) }
        { statsQuery.data && statsQuery.data.gas_prices && data.config.features.gasTracker.isEnabled && (
          <HStack gap={ 2 }>
            <Box color="text.secondary">Gas price</Box>
            <Skeleton loading={ statsQuery.isPlaceholderData }>
              <GasPrice data={ statsQuery.data.gas_prices.average }/>
            </Skeleton>
          </HStack>
        ) }
      </VStack>
    </Box>
  );
};

export default React.memo(HomeSubchainWidget);
