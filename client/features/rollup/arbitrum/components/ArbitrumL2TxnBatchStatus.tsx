// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ArbitrumL2TxnBatchesItem } from '../types/api';

import type { StatusTagType } from 'ui/shared/statusTag/StatusTag';
import StatusTag from 'ui/shared/statusTag/StatusTag';

export interface Props {
  status: ArbitrumL2TxnBatchesItem['commitment_transaction']['status'];
  isLoading?: boolean;
}

const ArbitrumL2TxnBatchStatus = ({ status, isLoading }: Props) => {
  let type: StatusTagType;

  switch (status) {
    case 'finalized':
      type = 'ok';
      break;
    default:
      type = 'pending';
      break;
  }

  return <StatusTag type={ type } text={ status } loading={ isLoading }/>;
};

export default ArbitrumL2TxnBatchStatus;
