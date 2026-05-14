// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { Block } from 'client/slices/block/types/api';
import type { ClusterChainConfig } from 'types/multichain';

import BlocksListItem from 'client/slices/block/pages/index/BlocksListItem';

import useInitialList from 'client/shared/lists/useInitialList';

interface Props {
  data: Array<Block>;
  isLoading: boolean;
  page: number;
  chainData?: ClusterChainConfig;
}

const BlocksList = ({ data, isLoading, page, chainData }: Props) => {
  const initialList = useInitialList({
    data: data ?? [],
    idFn: (item) => item.height,
    enabled: !isLoading,
  });

  return (
    <Box>
      { data.map((item, index) => (
        <BlocksListItem
          key={ item.height + (isLoading ? String(index) : '') }
          data={ item }
          isLoading={ isLoading }
          enableTimeIncrement={ page === 1 && !isLoading }
          animation={ initialList.getAnimationProp(item) }
          chainData={ chainData }
        />
      )) }
    </Box>
  );
};

export default BlocksList;
