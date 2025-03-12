import React from 'react';

import type { TransactionType } from 'types/api/transaction';

import Tag from 'ui/shared/chakra/Tag';

export interface Props {
  types: Array<TransactionType>;
  isLoading?: boolean;
}
import { useTranslation } from 'next-i18next';

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
  const typeToShow = types.sort((t1, t2) => TYPES_ORDER.indexOf(t1) - TYPES_ORDER.indexOf(t2))[0];
  const { t } = useTranslation('common');

  let label;
  let colorScheme;

  switch (typeToShow) {
    case 'contract_call':
      label = t('contract-call');
      colorScheme = 'blue';
      break;
    case 'blob_transaction':
      label = t('blob-txn');
      colorScheme = 'yellow';
      break;
    case 'contract_creation':
      label = t('contract-creation');
      colorScheme = 'blue';
      break;
    case 'token_transfer':
      label = t('token-transfer');
      colorScheme = 'orange';
      break;
    case 'token_creation':
      label = t('token-creation');
      colorScheme = 'orange';
      break;
    case 'coin_transfer':
      label = t('coin-transfer');
      colorScheme = 'orange';
      break;
    case 'rootstock_remasc':
      label = t('remasc');
      colorScheme = 'blue';
      break;
    case 'rootstock_bridge':
      label = t('bridge');
      colorScheme = 'blue';
      break;
    default:
      label = t('transaction');
      colorScheme = 'purple';
  }

  return (
    <Tag colorScheme={colorScheme} isLoading={isLoading}>
      {label}
    </Tag>
  );
};

export default TxType;
