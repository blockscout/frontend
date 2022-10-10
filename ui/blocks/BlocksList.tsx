import { Box } from '@chakra-ui/react';
import React from 'react';

import type { Block } from 'types/api/block';

import BlocksListItem from 'ui/blocks/BlocksListItem';

interface Props {
  data: Array<Block>;
}

const BlocksList = ({ data }: Props) => {
  return (
    <Box mt={ 8 }>
      { data.map((item, index) => <BlocksListItem key={ item.height } data={ item } isPending={ index === 0 }/>) }
    </Box>
  );
};

export default BlocksList;
