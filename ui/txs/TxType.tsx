/* eslint-disable */


import React from 'react';
import Tag from 'ui/shared/chakra/Tag';
import type { TransactionType } from 'types/api/transaction';

export interface Props {
  types: Array<TransactionType>;
  isLoading?: boolean;
}

const TYPES_ORDER: Array<TransactionType> = [
  'blob_transaction',
  'rootstock_remasc',
  'rootstock_bridge',
  'token_creation',
  'contract_creation',
  'token_transfer',
  'contract_call',
  'coin_transfer',
];

const TxType = ({ types, isLoading }: Props) => {
  const typeToShow = types?.sort((t1, t2) => TYPES_ORDER.indexOf(t1) - TYPES_ORDER.indexOf(t2))[0];

  let label;
  let colorScheme;

  switch (typeToShow) {
    case 'contract_call':
      label = 'Contract call';
      colorScheme = 'blue';
      break;
    case 'blob_transaction':
      label = 'Blob txn';
      colorScheme = 'yellow';
      break;
    case 'contract_creation':
      label = 'Contract creation';
      colorScheme = 'blue';
      break;
    case 'token_transfer':
      label = 'Token transfer';
      colorScheme = 'orange';
      break;
    case 'token_creation':
      label = 'Token creation';
      colorScheme = 'orange';
      break;
    case 'coin_transfer':
      label = 'Coin transfer';
      colorScheme = 'orange';
      break;
    case 'rootstock_remasc':
      label = 'REMASC';
      colorScheme = 'blue';
      break;
    case 'rootstock_bridge':
      label = 'Bridge';
      colorScheme = 'blue';
      break;
    default:
      label = 'Transaction';
      colorScheme = 'purple';
  }


  let _prop = { };

  if (colorScheme === 'blue') {
    _prop = {
      background: "var(--decorative-blue-5, #EEF8FB)",
      border: " 1px solid var(--decorative-blue-5, #EEF8FB)",
      color: 'var(--decorative-blue, #41AFB7)',
      fontSize: '0.75rem',
      fontWeight: 400,
      fontFamily: 'Outfit',
      fontStyle: 'normal',
      lineHeight: 'normal',
    }
  } else {
    _prop = {
      colorScheme : colorScheme,
    }
  }

  const textStyle = {
      fontSize: '0.75rem',
      fontWeight: 400,
      fontFamily: 'Outfit',
      fontStyle: 'normal',
      lineHeight: 'normal',
  }

  return (
    <Tag  px='0.5rem'  borderRadius='9999px'   height={"1.437rem"}
          isLoading={ isLoading } { ..._prop } margin={0} py={0} 
          display="inline-flex" alignItems="center">
      <span style={ textStyle }>
        { label }
      </span>
    </Tag>
  );
};

export default TxType;
