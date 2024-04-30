import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractMethodInput } from 'types/api/contract';

import { getFieldLabel } from './utils';

interface Props {
  data: SmartContractMethodInput;
  isOptional?: boolean;
  level: number;
}

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
      { getFieldLabel(data, !isOptional) }
    </Box>
  );
};

export default React.memo(ContractMethodFieldLabel);
