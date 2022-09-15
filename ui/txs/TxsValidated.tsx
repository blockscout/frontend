import { Box } from '@chakra-ui/react';
import React from 'react';

import Filters from 'ui/shared/Filters';

import TxsTable from './TxsTable';

const TxsValidated = () => {
  return (
    <>
      <Box mb={ 12 }>Only the first 10,000 elements are displayed</Box>
      <Box mb={ 6 }><Filters/></Box>
      <TxsTable/>
      { /* pagination */ }
    </>
  );
};

export default TxsValidated;
