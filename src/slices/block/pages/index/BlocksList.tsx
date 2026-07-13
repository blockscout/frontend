// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import BlocksListItem from 'src/slices/block/pages/index/BlocksListItem';

import useInitialList from 'src/shared/lists/useInitialList';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

interface Props {
  data: Array<schemas['Block']>;
  isLoading: boolean;
  page: number;
  chainData?: ClusterChainConfig;
  resetKey?: string;
}

const BlocksList = ({ data, isLoading, page, chainData, resetKey }: Props) => {
  const initialList = useInitialList({
    data: data ?? [],
    idFn: (item) => item.height,
    enabled: !isLoading,
  });
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <Box>
      { data.slice(0, renderedItemsNum).map((item, index) => (
        <BlocksListItem
          key={ item.height + (isLoading ? String(index) : '') }
          data={ item }
          isLoading={ isLoading }
          enableTimeIncrement={ page === 1 && !isLoading }
          animation={ initialList.getAnimationProp(item) }
          chainData={ chainData }
        />
      )) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default BlocksList;
