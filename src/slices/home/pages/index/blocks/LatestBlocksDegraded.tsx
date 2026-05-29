// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, VStack } from '@chakra-ui/react';
import React from 'react';

import type { Block } from 'src/slices/block/types/api';

import { route } from 'nextjs-routes';

import { BLOCK } from 'src/slices/block/stubs/block';
import { useHomeRpcDataContext } from 'src/slices/home/contexts/rpc-data-context';

import { publicClient } from 'src/features/connect-wallet/utils/public-client';

import useInitialList from 'src/shared/lists/useInitialList';

import { Link } from 'src/toolkit/chakra/link';

import LatestBlocksFallback from './LatestBlocksFallback';
import LatestBlocksItem from './LatestBlocksItem';

interface Props {
  maxNum: number;
}

const LatestBlocksDegraded = ({ maxNum }: Props) => {

  const { blocks, isError, isLoading, enable } = useHomeRpcDataContext();

  React.useEffect(() => {
    enable(true, 'latest-blocks');
    return () => {
      enable(false, 'latest-blocks');
    };
  }, [ enable ]);

  const initialList = useInitialList({
    data: [] as Array<Block>,
    idFn: (block) => block.height,
    enabled: !isError,
  });

  if (isError || !publicClient) {
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
