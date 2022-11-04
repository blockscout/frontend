import { Box } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import type { Block } from 'types/api/block';

import BlocksListItem from 'ui/blocks/BlocksListItem';

interface Props {
  data: Array<Block>;
}

const BlocksList = ({ data }: Props) => {
  return (
    <Box>
      <AnimatePresence initial={ false }>
        { /* TODO prop "enableTimeIncrement" should be set to false for second and later pages */ }
        { data.map((item) => <BlocksListItem key={ item.height } data={ item } enableTimeIncrement/>) }
      </AnimatePresence>
    </Box>
  );
};

export default BlocksList;
