// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import BlocksListItem from 'src/slices/block/pages/index/BlocksListItem';

import useInitialList from 'src/shared/lists/useInitialList';

interface Props {
  data: Array<schemas['Block']>;
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
