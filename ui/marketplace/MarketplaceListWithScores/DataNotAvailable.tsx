import { Tooltip, chakra } from '@chakra-ui/react';
import React from 'react';

const DataNotAvailable = () => {
  return (
    <Tooltip
      label="Data will be available soon"
      textAlign="center"
      padding={ 2 }
      openDelay={ 500 }
    >
      <chakra.span cursor="default" fontWeight="500" fontSize="sm">
        n/a
      </chakra.span>
    </Tooltip>
  );
};

export default DataNotAvailable;
