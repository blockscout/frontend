import { Box } from '@chakra-ui/react';
import React from 'react';

import { data } from 'data/txState';
import TxStateListItem from 'ui/tx/state/TxStateListItem';

const TxStateList = () => {
  return (
    <Box mt={ 6 }>
      { data.map((item, index) => <TxStateListItem key={ index } { ...item }/>) }
    </Box>
  );
};

export default TxStateList;
