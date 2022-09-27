import { Tag, TagLabel } from '@chakra-ui/react';
import React from 'react';

export interface Props {
  type: 'contract-call' | 'transaction' | 'token-transfer' | 'internal-tx' | 'multicall';
}

const TxStatus = ({ type }: Props) => {
  let label;
  let colorScheme;

  switch (type) {
    case 'contract-call':
      label = 'Contract call';
      colorScheme = 'blue';
      break;
    case 'transaction':
      label = 'Transaction';
      colorScheme = 'purple';
      break;
    case 'token-transfer':
      label = 'Token transfer';
      colorScheme = 'orange';
      break;
    case 'internal-tx':
      label = 'Internal txn';
      colorScheme = 'cyan';
      break;
    case 'multicall':
      label = 'Multicall';
      colorScheme = 'teal';
      break;
  }

  return (
    <Tag colorScheme={ colorScheme }>
      <TagLabel>{ label }</TagLabel>
    </Tag>
  );
};

export default TxStatus;
