import { Box } from '@chakra-ui/react';
import React from 'react';

import { data } from 'data/txLogs';
import TxLogItem from 'ui/tx/logs/TxLogItem';

const TxLogs = () => {
  return (
    <Box>
      { data.map((item, index) => <TxLogItem key={ index } { ...item } index={ index }/>) }
    </Box>
  );
};

export default TxLogs;
