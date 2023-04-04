import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TxStateChanges } from 'types/api/txStateChanges';

import TxStateListItem from 'ui/tx/state/TxStateListItem';

interface Props {
  data: TxStateChanges;
}

const TxStateList = ({ data }: Props) => {
  return (
    <Box mt={ 6 }>
      { data.map((item, index) => <TxStateListItem key={ index } data={ item }/>) }
    </Box>
  );
};

export default TxStateList;
