import { Box } from '@chakra-ui/react';
import React from 'react';

import SkeletonTable from 'ui/shared/SkeletonTable';

interface Props {
  showBlockInfo: boolean;
}

const TxsInternalsSkeletonDesktop = ({ showBlockInfo }: Props) => {
  return (
    <Box mb={ 8 }>
      <SkeletonTable columns={ showBlockInfo ?
        [ '32px', '22%', '160px', '20%', '18%', '292px', '20%', '20%' ] :
        [ '32px', '22%', '160px', '20%', '292px', '20%', '20%' ]
      }/>
    </Box>
  );
};

export default TxsInternalsSkeletonDesktop;
