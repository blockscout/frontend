import { Box } from '@chakra-ui/react';
import React from 'react';

import type { Block } from 'types/api/block';

import useInitialList from 'lib/hooks/useInitialList';
import BlocksListItem from 'ui/blocks/BlocksListItem';

interface Props {
  data: Array<Block>;
  isLoading: boolean;
  page: number;
}

const BlocksList = ({ data, isLoading, page }: Props) => {
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
        />
      )) }
    </Box>
  );
};

export default BlocksList;
