import { Box } from '@chakra-ui/react';
import React from 'react';

import { txs } from 'data/txs';
import TxsListItem from 'ui/txs/TxsListItem';

const TxsList = () => {
  return (
    <Box>
      { txs.map(tx => <TxsListItem tx={ tx } key={ tx.hash }/>) }
    </Box>
  );
};

export default TxsList;
