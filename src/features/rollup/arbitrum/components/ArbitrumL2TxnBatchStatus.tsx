// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ArbitrumL2TxnBatchesItem } from '../types/api';

import type { StatusTagType } from 'src/shared/tags/status-tag/StatusTag';
import StatusTag from 'src/shared/tags/status-tag/StatusTag';

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
