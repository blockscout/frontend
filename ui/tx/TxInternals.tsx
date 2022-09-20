import { Box } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import Filters from 'ui/shared/Filters';
import TxInternalsList from 'ui/tx/internals/TxInternalsList';
import TxInternalsTable from 'ui/tx/internals/TxInternalsTable';

const TxInternals = () => {
  const isMobile = useIsMobile();

  const list = isMobile ? <TxInternalsList/> : <TxInternalsTable/>;

  return (
    <Box>
      <Filters/>
      { list }
    </Box>
  );
};

export default TxInternals;
