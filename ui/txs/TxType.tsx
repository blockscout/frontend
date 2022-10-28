import { Tag } from '@chakra-ui/react';
import React from 'react';

import type { TransactionType } from 'types/api/transaction';

export interface Props {
  type: TransactionType;
}

const TxStatus = ({ type }: Props) => {
  let label;
  let colorScheme;

  switch (type) {
    case 'contract_call':
      label = 'Contract call';
      colorScheme = 'blue';
      break;
    case 'contract_creation':
      label = 'Contract creation';
      colorScheme = 'purple';
      break;
    case 'token_transfer':
      label = 'Token transfer';
      colorScheme = 'orange';
      break;
    case 'token_creation':
      label = 'Token creation';
      colorScheme = 'cyan';
      break;
    case 'coin_transfer':
      label = 'Coin transfer';
      colorScheme = 'teal';
      break;
  }

  return (
    <Tag colorScheme={ colorScheme }>
      { label }
    </Tag>
  );
};

export default TxStatus;
