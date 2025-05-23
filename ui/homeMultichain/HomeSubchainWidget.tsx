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
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

interface Props {
  data: SubchainConfig;
}

const HomeSubchainWidget = ({ data }: Props) => {
  const queryClient = useQueryClient();

  const blocksQuery = useApiQuery('general:homepage_blocks', {
    subchainId: data.id,
    queryOptions: {
      placeholderData: [ BLOCK ],
    },
  });

  const statsQuery = useApiQuery('general:stats', {
    subchainId: data.id,
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    const queryKey = getResourceKey('general:homepage_blocks', { subchainId: data.id });
    queryClient.setQueryData(queryKey, () => {
      return [ payload.block ];
    });
  }, [ queryClient, data.id ]);

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
      <HStack gap={ 3 }>
        <Image src={ data.icon } alt={ data.name } boxSize="30px" borderRadius="full"/>
        <Heading level="3">{ data.name }</Heading>
      </HStack>
      <VStack gap={ 2 } mt={ 5 } alignItems="flex-start">
        <HStack gap={ 2 }>
          <Box color="text.secondary">Chain ID</Box>
          <Box>{ data.chainId }</Box>
          <CopyToClipboard text={ data.chainId.toString() } ml={ 0 }/>
        </HStack>
        { blocksQuery.data?.[0] && (
          <HStack gap={ 2 }>
            <Box color="text.secondary">Latest block</Box>
            <Link
              loading={ blocksQuery.isPlaceholderData }
              href={ route({
                pathname: '/subchain/[subchain-id]/block/[height_or_hash]',
                query: {
                  'subchain-id': data.id,
                  height_or_hash: blocksQuery.data[0].height.toString(),
                },
              }) }
            >
              { blocksQuery.data[0].height }
            </Link>
            <TimeAgoWithTooltip
              timestamp={ blocksQuery.data[0].timestamp }
              enableIncrement={ !blocksQuery.isPlaceholderData }
              isLoading={ blocksQuery.isPlaceholderData }
              color="text.secondary"
              flexShrink={ 0 }
            />
          </HStack>
        ) }
        { statsQuery.data && statsQuery.data.gas_prices && (
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
