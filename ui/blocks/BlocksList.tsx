import { Box } from '@chakra-ui/react';
import React from 'react';

import { blocks } from 'data/blocks';
import BlocksListItem from 'ui/blocks/BlocksListItem';

const BlocksList = () => {
  return (
    <Box mt={ 8 }>
      { blocks.map((item, index) => <BlocksListItem key={ item.height } data={ item } isPending={ index === 0 }/>) }
    </Box>
  );
};

export default BlocksList;
