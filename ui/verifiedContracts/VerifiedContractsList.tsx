import { Box } from '@chakra-ui/react';
import React from 'react';

import type { VerifiedContract } from 'types/api/contracts';

import VerifiedContractsListItem from './VerifiedContractsListItem';

const VerifiedContractsList = ({ data }: { data: Array<VerifiedContract>}) => {
  return (
    <Box>
      { data.map((item) => <VerifiedContractsListItem key={ item.address.hash } data={ item }/>) }
    </Box>
  );
};

export default React.memo(VerifiedContractsList);
