import { chakra, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { CsvExportType } from '../../types/client';
import type { ClusterChainConfig } from 'types/multichain';

import shortenString from 'lib/shortenString';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';

import getPrefixByFilter from '../../utils/getPrefixByFilter';

interface Props {
  type: CsvExportType;
  params?: Record<string, string>;
  chainInfo?: ClusterChainConfig;
  recordsLimit: number;
}

const CsvExportDialogDescription = ({ type, params, chainInfo, recordsLimit }: Props) => {
  const chainInfoElement = chainInfo ? (
    <Flex display="inline-flex" alignItems="center" whiteSpace="pre">
      <span> on </span>
      <ChainIcon data={ chainInfo } mr={ 1 }/>
      <span>{ chainInfo.app_config.chain.name }</span>
    </Flex>
  ) : null;

  const limitText = recordsLimit.toLocaleString(undefined, { maximumFractionDigits: 3, notation: 'compact' });

  if (type === 'token_holders') {
    return (
      <Text>
        <span>Export holders for token </span>
        { params?.token_name && <chakra.span fontWeight="700">{ params.token_name }</chakra.span> }
        { chainInfoElement }
        <span> to CSV file. </span>
        <span>Limited to the top { limitText } holders by amount held.</span>
      </Text>
    );
  }

  if (type.startsWith('address_')) {
    const entityText = type.replace('address_', '').replace('_', ' ');
    const entityPrefix = getPrefixByFilter(params?.filter_type, params?.filter_value);
    return (
      <Text as="div">
        <span>Export { entityPrefix ? `${ entityPrefix } ` : '' }{ entityText } for address </span>
        { params?.hash && <chakra.span fontWeight="700">{ shortenString(params.hash) }</chakra.span> }
        { chainInfoElement }
        <span> to CSV file. </span>
        <span>Limited to the last { limitText } { entityText }.</span>
      </Text>
    );
  }

  return null;
};

export default React.memo(CsvExportDialogDescription);
