import { Flex } from '@chakra-ui/react';
import React from 'react';
import type { AbiFunction } from 'viem';

import type { FormSubmitResultPublicClient, ResultViewMode } from '../types';

import { Alert } from 'toolkit/chakra/alert';

import ResultItem from './resultPublicClient/Item';

export interface Props {
  data: FormSubmitResultPublicClient['data'];
  abiItem: AbiFunction;
  onSettle: () => void;
  mode: ResultViewMode;
}

const ContractMethodResultPublicClient = ({ data, abiItem, onSettle, mode: modeProps }: Props) => {
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
        <Alert status="error" mt={ 3 } p={ 4 } borderRadius="md" textStyle="sm" wordBreak="break-word" whiteSpace="pre-wrap">
          { 'shortMessage' in data && typeof data.shortMessage === 'string' ? data.shortMessage : data.message }
        </Alert>
      ) }
      <Flex
        flexDir="column"
        rowGap={ 2 }
        mt={ 3 }
        p={ 4 }
        borderRadius="md"
        bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
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
