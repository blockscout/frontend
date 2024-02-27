import { Alert, Box, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { ContractMethodReadResult } from './types';
import type { SmartContractQueryMethodReadSuccess, SmartContractReadMethod } from 'types/api/contract';

import hexToUtf8 from 'lib/hexToUtf8';

const TUPLE_TYPE_REGEX = /\[(.+)\]/;

const ContractReadResultError = ({ children }: {children: React.ReactNode}) => {
  return (
    <Alert status="error" mt={ 3 } p={ 4 } borderRadius="md" fontSize="sm" wordBreak="break-word" whiteSpace="pre-wrap">
      { children }
    </Alert>
  );
};

interface ItemProps {
  output: SmartContractQueryMethodReadSuccess['result']['output'][0];
  name: SmartContractQueryMethodReadSuccess['result']['names'][0];
}

const ContractReadResultItem = ({ output, name }: ItemProps) => {
  if (Array.isArray(name)) {
    const [ structName, argNames ] = name;
    const argTypes = output.type.match(TUPLE_TYPE_REGEX)?.[1].split(',');

    return (
      <>
        <p>
          <chakra.span fontWeight={ 500 }>  { structName }</chakra.span>
          <span> ({ output.type }) :</span>
        </p>
        { argNames.map((argName, argIndex) => {
          return (
            <p key={ argName }>
              <chakra.span fontWeight={ 500 }>      { argName }</chakra.span>
              <span>{ argTypes?.[argIndex] ? ` (${ argTypes[argIndex] })` : '' } : { String(output.value[argIndex]) }</span>
            </p>
          );
        }) }
      </>
    );
  }

  return (
    <p>
      <span>  </span>
      { name && <chakra.span fontWeight={ 500 }>{ name } </chakra.span> }
      <span>({ output.type }) : { String(output.value) }</span>
    </p>
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
    <Box mt={ 3 } p={ 4 } borderRadius="md" bgColor={ resultBgColor } fontSize="sm" whiteSpace="break-spaces" wordBreak="break-all">
      <p>
        [ <chakra.span fontWeight={ 500 }>{ 'name' in item ? item.name : '' }</chakra.span> method response ]
      </p>
      <p>[</p>
      { result.result.output.map((output, index) => <ContractReadResultItem key={ index } output={ output } name={ result.result.names[index] }/>) }
      <p>]</p>
    </Box>
  );
};

export default React.memo(ContractReadResult);
