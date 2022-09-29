import { Box } from '@chakra-ui/react';
import React from 'react';

import type { data as txData } from 'data/txInternal';
import useNetwork from 'lib/hooks/useNetwork';
import TxInternalsListItem from 'ui/tx/internals/TxInternalsListItem';

const TxInternalsList = ({ data }: { data: typeof txData}) => {
  const selectedNetwork = useNetwork();

  return (
    <Box mt={ 6 }>
      { data.map((item) => <TxInternalsListItem key={ item.id } { ...item } currency={ selectedNetwork?.currency }/>) }
    </Box>
  );
};

export default TxInternalsList;
