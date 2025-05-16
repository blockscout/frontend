import { Box } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import type { Epoch } from 'types/api/epoch';

import EpochListItem from './EpochListItem';

interface Props {
  data: Array<Epoch>;
  isLoading: boolean;
}

const EpochList = ({ data, isLoading }: Props) => {
  return (
    <Box>
      <AnimatePresence initial={ false }>
        { data.map((item) => (
          <EpochListItem
            key={ item.id }
            data={ item }
            isLoading={ isLoading }
          />
        )) }
      </AnimatePresence>
    </Box>
  );
};

export default EpochList;
