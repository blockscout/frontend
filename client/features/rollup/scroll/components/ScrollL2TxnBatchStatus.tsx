// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { StatusTagType } from 'ui/shared/statusTag/StatusTag';
import StatusTag from 'ui/shared/statusTag/StatusTag';

export interface Props {
  status: 'Finalized' | 'Committed';
  isLoading?: boolean;
}

const ScrollL2TxnBatchStatus = ({ status, isLoading }: Props) => {
  let type: StatusTagType;

  switch (status) {
    case 'Finalized':
      type = 'ok';
      break;
    default:
      type = 'pending';
      break;
  }

  return <StatusTag type={ type } text={ status } loading={ isLoading }/>;
};

export default ScrollL2TxnBatchStatus;
