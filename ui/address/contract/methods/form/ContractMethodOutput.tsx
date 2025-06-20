import { Flex } from '@chakra-ui/react';
import React from 'react';
import type { AbiFunction } from 'viem';

import type { ResultViewMode } from '../types';

import ResultItem from './resultPublicClient/Item';

export interface Props {
  data: unknown;
  abiItem: AbiFunction;
  onSettle: () => void;
  mode: ResultViewMode;
}

const ContractMethodOutput = ({ data, abiItem, onSettle, mode }: Props) => {
  React.useEffect(() => {
    if (mode === 'result') {
      onSettle();
    }
  }, [ onSettle, mode ]);

  const formattedData = (() => {
    return abiItem && abiItem.outputs.length > 1 && Array.isArray(data) ? data : [ data ];
  })();

  return (
    <Flex
      flexDir="column"
      rowGap={ 2 }
      mt={ 3 }
      px={ 3 }
      py={ 2 }
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
          data={ formattedData[index] }
          mode={ mode }
        />
      )) }
    </Flex>
  );
};

export default React.memo(ContractMethodOutput);
