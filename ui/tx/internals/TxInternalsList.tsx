import { Box } from '@chakra-ui/react';
import React from 'react';

import type { data as txData } from 'data/txInternal';
import TxInternalsListItem from 'ui/tx/internals/TxInternalsListItem';

const TxInternalsList = ({ data }: { data: typeof txData}) => {
  return (
    <Box mt={ 6 }>
      { data.map((item) => <TxInternalsListItem key={ item.id } { ...item }/>) }
    </Box>
  );
};

export default TxInternalsList;
