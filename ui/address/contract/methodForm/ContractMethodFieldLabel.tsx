import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractMethodInput } from 'types/api/contract';

interface Props {
  data: SmartContractMethodInput;
  isOptional?: boolean;
  level: number;
}

// TODO @tom2drum add helper to get lable text
const ContractMethodFieldLabel = ({ data, isOptional, level }: Props) => {
  const color = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');

  return (
    <Box
      w="250px"
      fontSize="sm"
      lineHeight={ 5 }
      py="6px"
      flexShrink={ 0 }
      fontWeight={ 500 }
      color={ level > 1 ? color : undefined }
    >
      { data.name || '<arg w/o name>' } ({ data.type }){ !isOptional && '*' }
    </Box>
  );
};

export default React.memo(ContractMethodFieldLabel);
