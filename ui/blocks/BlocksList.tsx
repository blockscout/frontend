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
      { data.map((item) => <BlocksListItem key={ item.height } data={ item }/>) }
    </Box>
  );
};

export default BlocksList;
