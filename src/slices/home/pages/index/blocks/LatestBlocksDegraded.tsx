// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, VStack } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { BLOCK_ITEM } from 'src/slices/block/stubs/list';
import { useHomeRpcDataContext } from 'src/slices/home/contexts/rpc-data-context';

import { isPublicClientAvailable } from 'src/features/connect-wallet/utils/public-client';

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
    data: [] as Array<schemas['Block']>,
    idFn: (block) => block.height,
    enabled: !isError,
  });

  if (isError || !isPublicClientAvailable) {
    return <LatestBlocksFallback/>;
  }

  const items = isLoading ? Array(maxNum).fill(BLOCK_ITEM) : blocks.slice(0, maxNum);

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
