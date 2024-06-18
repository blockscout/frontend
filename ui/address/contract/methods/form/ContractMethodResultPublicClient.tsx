import { Alert, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { AbiFunction } from 'viem';

import type { FormSubmitResultPublicClient } from '../types';

import ResultItem from './resultPublicClient/Item';

interface Props {
  data: FormSubmitResultPublicClient['data'];
  abiItem: AbiFunction;
  onSettle: () => void;
}

const ContractMethodResultPublicClient = ({ data, abiItem, onSettle }: Props) => {
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
    return abiItem.outputs.length > 1 && Array.isArray(data) ? data : [ data ];
  })();

  return (
    <Flex
      flexDir="column"
      rowGap={ 2 }
      mt={ 3 }
      p={ 4 }
      borderRadius="md"
      bgColor={ bgColor }
      fontSize="sm"
      lineHeight="20px"
      whiteSpace="break-spaces"
      wordBreak="break-all"
    >
      { abiItem.outputs.map((output, index) => <ResultItem key={ index } abiParameter={ output } data={ formattedData[index] }/>) }
    </Flex>
  );
};

export default React.memo(ContractMethodResultPublicClient);
