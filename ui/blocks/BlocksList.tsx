import { Box } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import type { Block } from 'types/api/block';

import BlocksListItem from 'ui/blocks/BlocksListItem';

interface Props {
  data: Array<Block>;
  isLoading: boolean;
  page: number;
}

const BlocksList = ({ data, isLoading, page }: Props) => {
  return (
    <Box>
      <AnimatePresence initial={ false }>
        { data.map((item, index) => (
          <BlocksListItem
            key={ item.height + (isLoading ? String(index) : '') }
            data={ item }
            isLoading={ isLoading }
            enableTimeIncrement={ page === 1 && !isLoading }
          />
        )) }
      </AnimatePresence>
    </Box>
  );
};

export default BlocksList;
