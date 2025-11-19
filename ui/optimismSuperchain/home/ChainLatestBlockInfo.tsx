import { Box, HStack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { ClusterChainConfig } from 'types/multichain';

import { route } from 'nextjs-routes';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { BLOCK } from 'stubs/block';
import { Link } from 'toolkit/chakra/link';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

interface Props {
  chainData: ClusterChainConfig;
}

const ChainLatestBlockInfo = ({ chainData }: Props) => {
  const queryClient = useQueryClient();

  const blocksQuery = useApiQuery('general:homepage_blocks', {
    chain: chainData,
    queryOptions: {
      placeholderData: [ BLOCK ],
    },
  });

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    const queryKey = getResourceKey('general:homepage_blocks', { chainId: chainData.id });
    queryClient.setQueryData(queryKey, () => {
      return [ payload.block ];
    });
  }, [ queryClient, chainData.id ]);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
    isDisabled: blocksQuery.isPlaceholderData || blocksQuery.isError,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  if (!blocksQuery.data?.[0]) {
    return null;
  }

  return (
    <HStack gap={ 2 }>
      <Box color="text.secondary">Latest block</Box>
      <Link
        loading={ blocksQuery.isPlaceholderData }
        href={ route({
          pathname: '/chain/[chain_slug]/block/[height_or_hash]',
          query: {
            chain_slug: chainData.slug,
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
  );
};

export default React.memo(ChainLatestBlockInfo);
