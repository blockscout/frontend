import { Box } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import TxInternalsListItem from 'ui/tx/internals/TxInternalsListItem';

const TxInternalsList = ({ data }: { data: Array<InternalTransaction>}) => {
  return (
    <Box>
      { data.map((item) => <TxInternalsListItem key={ item.transaction_hash } { ...item }/>) }
    </Box>
  );
};

export default TxInternalsList;
