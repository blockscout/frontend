import { Box } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import Filters from 'ui/shared/Filters';

import Pagination from './Pagination';
import TxsList from './TxsList';
import TxsTable from './TxsTable';

const TxsValidated = () => {
  const isMobile = useIsMobile();
  return (
    <>
      <Box mb={ 12 }>Only the first 10,000 elements are displayed</Box>
      <Box mb={ 6 }><Filters/></Box>
      { isMobile ? <TxsList/> : <TxsTable/> }
      <Box mx={ isMobile ? 0 : 6 } my={ isMobile ? 6 : 3 }>
        <Pagination currentPage={ 1 } isMobile={ isMobile }/>
      </Box>
    </>
  );
};

export default TxsValidated;
