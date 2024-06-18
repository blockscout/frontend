import { Alert, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { AbiFunction } from 'viem';

import type { FormSubmitResultPublicClient, ResultViewMode } from '../types';

import ResultItem from './resultPublicClient/Item';

interface Props {
  data: FormSubmitResultPublicClient['data'];
  abiItem: AbiFunction;
  onSettle: () => void;
  mode: ResultViewMode;
}

const ContractMethodResultPublicClient = ({ data, abiItem, onSettle, mode }: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  React.useEffect(() => {
    if (mode === 'result') {
      onSettle();
    }
  }, [ onSettle, mode ]);

  const formattedData = (() => {
    return abiItem.outputs.length > 1 && Array.isArray(data) ? data : [ data ];
  })();

  return (
    <>
      { data instanceof Error && (
        <Alert status="error" mt={ 3 } p={ 4 } borderRadius="md" fontSize="sm" wordBreak="break-word" whiteSpace="pre-wrap">
          { 'shortMessage' in data && typeof data.shortMessage === 'string' ? data.shortMessage : data.message }
        </Alert>
      ) }
      <Flex
        flexDir="column"
        rowGap={ 2 }
        mt={ 3 }
        p={ 4 }
        borderRadius="md"
        bgColor={ bgColor }
        opacity={ mode === 'preview' ? 0.8 : 1 }
        fontSize="sm"
        lineHeight="20px"
        whiteSpace="break-spaces"
        wordBreak="break-all"
      >
        { abiItem.outputs.map((output, index) => (
          <ResultItem
            key={ index }
            abiParameter={ output }
            data={ data instanceof Error ? undefined : formattedData[index] }
            mode={ mode }
          />
        )) }
      </Flex>
    </>
  );
};

export default React.memo(ContractMethodResultPublicClient);
