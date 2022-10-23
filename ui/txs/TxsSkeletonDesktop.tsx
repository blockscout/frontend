import { Box } from '@chakra-ui/react';
import React from 'react';

import SkeletonTable from 'ui/shared/SkeletonTable';

const TxsInternalsSkeletonDesktop = () => {
  return (
    <Box mb={ 8 }>
      <SkeletonTable columns={ [ '32px', '20%', '18%', '15%', '11%', '292px', '18%', '18%' ] }/>
    </Box>
  );
};

export default TxsInternalsSkeletonDesktop;
