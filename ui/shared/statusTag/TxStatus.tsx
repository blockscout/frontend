import { useTranslation } from 'next-i18next';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import type { StatusTagType } from './StatusTag';
import StatusTag from './StatusTag';

export interface Props {
  status: Transaction['status'];
  errorText?: string | null;
  isLoading?: boolean;
}

const TxStatus = ({ status, errorText, isLoading }: Props) => {
  const { t } = useTranslation('common');

  if (status === undefined) {
    return null;
  }

  let text;
  let type: StatusTagType;

  switch (status) {
    case 'ok':
      text = t('tx_status.Success');
      type = 'ok';
      break;
    case 'error':
      text = t('tx_status.Failed');
      type = 'error';
      break;
    case null:
      text = t('tx_status.Pending');
      type = 'pending';
      break;
  }

  return <StatusTag type={ type } text={ text } errorText={ errorText } isLoading={ isLoading }/>;
};

export default TxStatus;
