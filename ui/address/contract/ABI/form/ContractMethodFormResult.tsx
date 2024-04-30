import { Box } from '@chakra-ui/react';
import React from 'react';

import type { FormSubmitResult, ContractAbiItem } from '../types';

interface Props {
  abiItem: ContractAbiItem;
  result: FormSubmitResult;
  onSettle: () => void;
}

const ContractMethodFormResult = (props: Props) => {
  // eslint-disable-next-line no-console
  console.log('__>__', props);
  return <Box>ContractMethodFormResult</Box>;
};

export default ContractMethodFormResult;
