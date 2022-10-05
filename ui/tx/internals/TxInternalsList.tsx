import { Box } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import useNetwork from 'lib/hooks/useNetwork';
import TxInternalsListItem from 'ui/tx/internals/TxInternalsListItem';

const TxInternalsList = ({ data }: { data: Array<InternalTransaction>}) => {
  const selectedNetwork = useNetwork();

  return (
    <Box mt={ 6 }>
      { data.map((item) => <TxInternalsListItem key={ item.transaction_hash } { ...item } currency={ selectedNetwork?.currency }/>) }
    </Box>
  );
};

export default TxInternalsList;
