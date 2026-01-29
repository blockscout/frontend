import React from 'react';

import type { ZkSyncBatchStatus } from 'types/api/zkSyncL2';

import type { StatusTagType } from './StatusTag';
import StatusTag from './StatusTag';

export interface Props {
  status: ZkSyncBatchStatus;
  isLoading?: boolean;
}

const ZkSyncL2TxnBatchStatus = ({ status, isLoading }: Props) => {
  let type: StatusTagType;

  switch (status) {
    case 'Executed on L1':
      type = 'ok';
      break;
    default:
      type = 'pending';
      break;
  }

  return <StatusTag type={ type } text={ status } loading={ isLoading }/>;
};

export default ZkSyncL2TxnBatchStatus;
