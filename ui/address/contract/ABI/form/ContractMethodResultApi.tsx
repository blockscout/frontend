import { Box, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { ContractAbiItem, FormSubmitResultApi } from '../types';

import hexToUtf8 from 'lib/hexToUtf8';

import ContractMethodResultApiError from './ContractMethodResultApiError';
import ContractMethodResultApiItem from './ContractMethodResultApiItem';

interface Props {
  item: ContractAbiItem;
  result: FormSubmitResultApi['result'];
  onSettle: () => void;
}

const ContractMethodResultApi = ({ item, result, onSettle }: Props) => {
  const resultBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  React.useEffect(() => {
    onSettle();
  }, [ onSettle ]);

  if ('status' in result) {
    return <ContractMethodResultApiError>{ result.statusText }</ContractMethodResultApiError>;
  }

  if (result instanceof Error) {
    return <ContractMethodResultApiError>{ result.message }</ContractMethodResultApiError>;
  }

  if (result.is_error) {
    if ('error' in result.result) {
      return <ContractMethodResultApiError>{ result.result.error }</ContractMethodResultApiError>;
    }

    if ('message' in result.result) {
      return <ContractMethodResultApiError>[{ result.result.code }] { result.result.message }</ContractMethodResultApiError>;
    }

    if ('raw' in result.result) {
      return <ContractMethodResultApiError>{ `Revert reason: ${ hexToUtf8(result.result.raw) }` }</ContractMethodResultApiError>;
    }

    if ('method_id' in result.result) {
      return <ContractMethodResultApiError>{ JSON.stringify(result.result, undefined, 2) }</ContractMethodResultApiError>;
    }

    return <ContractMethodResultApiError>Something went wrong.</ContractMethodResultApiError>;
  }

  return (
    <Box mt={ 3 } p={ 4 } borderRadius="md" bgColor={ resultBgColor } fontSize="sm" whiteSpace="break-spaces" wordBreak="break-all">
      <p>
        [ <chakra.span fontWeight={ 500 }>{ 'name' in item ? item.name : '' }</chakra.span> method response ]
      </p>
      <p>[</p>
      { result.result.output.map((output, index) => <ContractMethodResultApiItem key={ index } output={ output } name={ result.result.names[index] }/>) }
      <p>]</p>
    </Box>
  );
};

export default React.memo(ContractMethodResultApi);
