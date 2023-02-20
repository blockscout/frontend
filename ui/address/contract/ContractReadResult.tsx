import { Alert, Box, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { ContractMethodReadResult } from './types';
import type { SmartContractReadMethod } from 'types/api/contract';

interface Props {
  item: SmartContractReadMethod;
  result: ContractMethodReadResult;
  onSettle: () => void;
}

const ContractReadResult = ({ item, result, onSettle }: Props) => {
  const resultBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  React.useEffect(() => {
    onSettle();
  }, [ onSettle ]);

  if ('status' in result) {
    return <Alert status="error" mt={ 3 } p={ 4 } borderRadius="md" fontSize="sm" wordBreak="break-word">{ result.statusText }</Alert>;
  }

  if (result.is_error) {
    const message = 'error' in result.result ? result.result.error : result.result.message;
    return <Alert status="error" mt={ 3 } p={ 4 } borderRadius="md" fontSize="sm" wordBreak="break-word">{ message }</Alert>;
  }

  return (
    <Box mt={ 3 } p={ 4 } borderRadius="md" bgColor={ resultBgColor } fontSize="sm">
      <p>
        [ <chakra.span fontWeight={ 600 }>{ 'name' in item ? item.name : '' }</chakra.span> method response ]
      </p>
      <p>[</p>
      { result.result.output.map(({ type, value }, index) => (
        <chakra.p key={ index } whiteSpace="break-spaces" wordBreak="break-all">  { type }: { String(value) }</chakra.p>
      )) }
      <p>]</p>
    </Box>
  );
};

export default React.memo(ContractReadResult);
