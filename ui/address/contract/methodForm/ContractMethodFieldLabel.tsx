import { Box } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractMethodInput } from 'types/api/contract';

interface Props {
  data: SmartContractMethodInput;
  isOptional?: boolean;
}

// TODO @tom2drum add helper to get lable text
const ContractMethodFieldLabel = ({ data, isOptional }: Props) => {
  return (
    <Box
      w="250px"
      fontSize="sm"
      lineHeight={ 5 }
      py="6px"
      flexShrink={ 0 }
      fontWeight={ 500 }
    >
      { data.name || '<arg w/o name>' } ({ data.type }){ !isOptional && '*' }
    </Box>
  );
};

export default React.memo(ContractMethodFieldLabel);
