import { Tag } from '@chakra-ui/react';
import React from 'react';

import type { TransactionType } from 'types/api/transaction';

export interface Props {
  types: Array<TransactionType>;
}

const TYPES_ORDER = [ 'token_creation', 'contract_creation', 'token_transfer', 'contract_call', 'coin_transfer' ];

const TxType = ({ types }: Props) => {
  const typeToShow = types.sort((t1, t2) => TYPES_ORDER.indexOf(t1) - TYPES_ORDER.indexOf(t2))[0];

  let label;
  let colorScheme;

  switch (typeToShow) {
    case 'contract_call':
      label = 'Contract call';
      colorScheme = 'green';
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
    default:
      label = 'Transaction';
      colorScheme = 'blue';

  }

  return (
    <Tag colorScheme={ colorScheme }>
      { label }
    </Tag>
  );
};

export default TxType;
