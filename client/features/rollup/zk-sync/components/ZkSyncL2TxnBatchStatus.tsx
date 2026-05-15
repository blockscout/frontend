// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ZkSyncBatchStatus } from 'client/features/rollup/zk-sync/types/api';

import { layerLabels } from 'client/features/rollup/common/utils/layer';

import type { StatusTagType } from 'ui/shared/statusTag/StatusTag';
import StatusTag from 'ui/shared/statusTag/StatusTag';

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

  const text = status.replace('L1', layerLabels.parent).replace('L2', layerLabels.current);

  return <StatusTag type={ type } text={ text } loading={ isLoading }/>;
};

export default ZkSyncL2TxnBatchStatus;
