import { Alert, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { AbiFunction } from 'viem';

import type { FormSubmitResultPublicClient, ResultViewMode } from '../types';

import ResultItem from './resultPublicClient/Item';

export interface Props {
  data: FormSubmitResultPublicClient['data'];
  abiItem: AbiFunction;
  onSettle: () => void;
  mode: ResultViewMode;
}

const ContractMethodResultPublicClient = ({ data, abiItem, onSettle, mode: modeProps }: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  React.useEffect(() => {
    if (modeProps === 'result') {
      onSettle();
    }
  }, [ onSettle, modeProps ]);

  const formattedData = (() => {
    return abiItem.outputs.length > 1 && Array.isArray(data) ? data : [ data ];
  })();

  const isError = data instanceof Error;
  const mode = isError ? 'preview' : modeProps;

  return (
    <>
      { isError && (
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
        color={ mode === 'preview' ? 'gray.500' : undefined }
        fontSize="sm"
        lineHeight="20px"
        whiteSpace="break-spaces"
        wordBreak="break-all"
      >
        { abiItem.outputs.map((output, index) => (
          <ResultItem
            key={ index }
            abiParameter={ output }
            data={ isError ? undefined : formattedData[index] }
            mode={ mode }
          />
        )) }
      </Flex>
    </>
  );
};

export default React.memo(ContractMethodResultPublicClient);
