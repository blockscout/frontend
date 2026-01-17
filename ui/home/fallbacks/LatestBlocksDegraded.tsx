import { Box, Flex, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { Block } from 'types/api/block';

import { route } from 'nextjs-routes';

import useInitialList from 'lib/hooks/useInitialList';
import { publicClient } from 'lib/web3/client';
import formatBlockData from 'lib/web3/rpc/formatBlockData';
import { BLOCK } from 'stubs/block';
import { Link } from 'toolkit/chakra/link';
import { SECOND } from 'toolkit/utils/consts';

import LatestBlocksItem from '../LatestBlocksItem';
import LatestBlocksFallback from './LatestBlocksFallback';

const LIMIT = 5;

interface Props {
  maxNum: number;
}

const LatestBlocksDegraded = ({ maxNum }: Props) => {

  const [ blocks, setBlocks ] = React.useState<Array<Block>>([]);
  const [ isError, setIsError ] = React.useState(false);
  const [ isLoading, setIsLoading ] = React.useState(true);

  const initialList = useInitialList({
    data: [] as Array<Block>,
    idFn: (block) => block.height,
    enabled: !isError,
  });

  const query = useQuery({
    queryKey: [ 'RPC', 'watch-blocks' ],
    queryFn: async() => {
      if (!publicClient) {
        return null;
      }
      setBlocks([]);
      setIsError(false);
      setIsLoading(true);

      return publicClient.watchBlocks({
        onBlock: (block) => {
          setIsLoading(false);
          setBlocks((prev) => {
            try {
              return [ formatBlockData(block), ...prev ].filter(Boolean).slice(0, LIMIT);
            } catch (_) {
              setIsError(true);
              return prev;
            }
          });
        },
        onError: () => {
          setIsError(true);
          setIsLoading(false);
        },
        pollingInterval: 5 * SECOND,
      });
    },
    enabled: Boolean(publicClient),
  });

  const unwatch = query.data;

  React.useEffect(() => {
    return () => {
      unwatch?.();
    };
  }, [ unwatch ]);

  if (query.isError || isError || !publicClient) {
    return <LatestBlocksFallback/>;
  }

  const items = isLoading ? Array(maxNum).fill(BLOCK) : blocks.slice(0, maxNum);

  if (items.length === 0) {
    return <Box textStyle="sm">No latest blocks found.</Box>;
  }

  return (
    <>
      <VStack gap={ 2 } mb={ 3 } overflow="hidden" alignItems="stretch">
        { items.map(((block, index) => (
          <LatestBlocksItem
            key={ block.height + (isLoading ? String(index) : '') }
            block={ block }
            isLoading={ isLoading }
            animation={ initialList.getAnimationProp(block) }
          />
        ))) }
      </VStack>
      <Flex justifyContent="center">
        <Link textStyle="sm" href={ route({ pathname: '/blocks' }) } loading={ isLoading }>View all blocks</Link>
      </Flex>
    </>
  );
};

export default React.memo(LatestBlocksDegraded);
