import { Alert, Box, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { ContractMethodReadResult } from './types';
import type { SmartContractReadMethod } from 'types/api/contract';

import hexToUtf8 from 'lib/hexToUtf8';

const ContractReadResultError = ({ children }: {children: React.ReactNode}) => {
  return (
    <Alert status="error" mt={ 3 } p={ 4 } borderRadius="md" fontSize="sm" wordBreak="break-word" whiteSpace="pre-wrap">
      { children }
    </Alert>
  );

};

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
    return <ContractReadResultError>{ result.statusText }</ContractReadResultError>;
  }

  if (result.is_error) {
    if ('error' in result.result) {
      return <ContractReadResultError>{ result.result.error }</ContractReadResultError>;
    }

    if ('message' in result.result) {
      return <ContractReadResultError>[{ result.result.code }] { result.result.message }</ContractReadResultError>;
    }

    if ('raw' in result.result) {
      return <ContractReadResultError>{ `Revert reason: ${ hexToUtf8(result.result.raw) }` }</ContractReadResultError>;
    }

    if ('method_id' in result.result) {
      return <ContractReadResultError>{ JSON.stringify(result.result, undefined, 2) }</ContractReadResultError>;
    }

    return <ContractReadResultError>Something went wrong.</ContractReadResultError>;
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
