import { useTranslation } from 'next-i18next';
import React from 'react';

import type { TransactionType } from 'types/api/transaction';

import Tag from 'ui/shared/chakra/Tag';

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
  const { t } = useTranslation('common');

  const typeToShow = types.sort((t1, t2) => TYPES_ORDER.indexOf(t1) - TYPES_ORDER.indexOf(t2))[0];

  let label;
  let colorScheme;

  switch (typeToShow) {
    case 'contract_call':
      label = t('tx_type.contract_call');
      colorScheme = 'blue';
      break;
    case 'blob_transaction':
      label = t('tx_type.blob_txn');
      colorScheme = 'yellow';
      break;
    case 'contract_creation':
      label = t('tx_type.contract_creation');
      colorScheme = 'blue';
      break;
    case 'token_transfer':
      label = t('tx_type.token_transfer');
      colorScheme = 'orange';
      break;
    case 'token_creation':
      label = t('tx_type.token_creation');
      colorScheme = 'orange';
      break;
    case 'coin_transfer':
      label = t('tx_type.coin_transfer');
      colorScheme = 'orange';
      break;
    case 'rootstock_remasc':
      label = 'REMASC';
      colorScheme = 'blue';
      break;
    case 'rootstock_bridge':
      label = t('tx_type.bridge');
      colorScheme = 'blue';
      break;
    default:
      label = t('tx_type.transaction');
      colorScheme = 'purple';
  }

  return (
    <Tag colorScheme={ colorScheme } isLoading={ isLoading }>
      { label }
    </Tag>
  );
};

export default TxType;
