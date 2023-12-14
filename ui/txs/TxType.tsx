import type { AspectMethod } from 'aspect/tag';
import { tagList } from 'aspect/tag';
import React from 'react';

import type { TransactionType } from 'types/api/transaction';

import Tag from 'ui/shared/chakra/Tag';
export interface Props {
  rawInput: string;
  types: Array<TransactionType>;
  isLoading?: boolean;
}

const TYPES_ORDER = [ 'rootstock_remasc', 'rootstock_bridge', 'token_creation', 'contract_creation', 'token_transfer', 'contract_call', 'coin_transfer' ];

const TxType = ({ rawInput, types, isLoading }: Props) => {
  const typeToShow = types.sort((t1, t2) => TYPES_ORDER.indexOf(t1) - TYPES_ORDER.indexOf(t2))[0];
  let label;
  let colorScheme;
  const findMethodBySignature = (signature: string, list: Array<AspectMethod>) => {
    const item = list.find((element: AspectMethod) => element.Signature === signature);
    return item ? item.Method : null;
  };
  switch (typeToShow) {
    case 'contract_call':
      label = 'Contract call';
      colorScheme = 'blue';
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
  if (findMethodBySignature(rawInput.substring(0, 10), tagList)) {
    label = findMethodBySignature(rawInput.substring(0, 10), tagList);
  }
  return (
    <Tag colorScheme={ colorScheme } isLoading={ isLoading }>
      { label }
    </Tag>
  );
};

export default TxType;
