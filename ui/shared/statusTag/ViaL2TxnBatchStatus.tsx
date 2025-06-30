import React from 'react';

import type { ViaBatchStatus } from 'types/api/viaL2';

import type { StatusTagType } from './StatusTag';
import StatusTag from './StatusTag';

export interface Props {
  status: ViaBatchStatus;
  isLoading?: boolean;
}

const ViaL2TxnBatchStatus = ({ status, isLoading }: Props) => {
  let type: StatusTagType;

  switch (status) {
    case 'Executed on L1':
      type = 'ok';
      break;
    default:
      type = 'pending';
      break;
  }

  return <StatusTag type={ type } text={ status } isLoading={ isLoading }/>;
};

export default ViaL2TxnBatchStatus;
