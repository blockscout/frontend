import { Box } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import Filters from 'ui/shared/Filters';

import TxsList from './TxsList';
import TxsTable from './TxsTable';

const TxsValidated = () => {
  const isMobile = useIsMobile();
  return (
    <>
      <Box mb={ 12 }>Only the first 10,000 elements are displayed</Box>
      <Box mb={ 6 }><Filters/></Box>
      { isMobile ? <TxsList/> : <TxsTable/> }
      { /* pagination */ }
    </>
  );
};

export default TxsValidated;
