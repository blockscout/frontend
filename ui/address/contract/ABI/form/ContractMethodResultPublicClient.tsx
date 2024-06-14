import { Alert, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { AbiFunction } from 'viem';

import type { FormSubmitResultPublicClient } from '../types';

import ResultItem from './resultPublicClient/Item';

interface Props {
  data: FormSubmitResultPublicClient['data'];
  item: AbiFunction;
  onSettle: () => void;
}

const ContractMethodResultPublicClient = ({ data, item, onSettle }: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  React.useEffect(() => {
    onSettle();
  }, [ onSettle ]);

  if (data instanceof Error) {
    return (
      <Alert status="error" mt={ 3 } p={ 4 } borderRadius="md" fontSize="sm" wordBreak="break-word" whiteSpace="pre-wrap">
        { 'shortMessage' in data && typeof data.shortMessage === 'string' ? data.shortMessage : data.message }
      </Alert>
    );
  }

  const formattedData = (() => {
    if (item.outputs.length === 1) {
      return Array.isArray(data) && data.length === 1 ? data : [ data ];
    }
    return Array.isArray(data) ? data : [ data ];
  })();

  return (
    <Box mt={ 3 } p={ 4 } borderRadius="md" bgColor={ bgColor } fontSize="sm" whiteSpace="break-spaces" wordBreak="break-all">
      <p>[</p>
      { item.outputs.map((output, index) => <ResultItem key={ index } abiParameter={ output } data={ formattedData[index] }/>) }
      <p>]</p>
    </Box>
  );
};

export default React.memo(ContractMethodResultPublicClient);
