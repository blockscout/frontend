import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ContractAbiItemInput } from '../types';

import { getFieldLabel } from './utils';

interface Props {
  data: ContractAbiItemInput;
  isOptional?: boolean;
  level: number;
}

const ContractMethodFieldLabel = ({ data, isOptional, level }: Props) => {
  return (
    <Box
      w="250px"
      textStyle="sm"
      py="6px"
      flexShrink={ 0 }
      fontWeight={ 500 }
      color={ level > 1 ? { _light: 'blackAlpha.600', _dark: 'whiteAlpha.600' } : undefined }
    >
      { getFieldLabel(data, !isOptional) }
    </Box>
  );
};

export default React.memo(ContractMethodFieldLabel);
