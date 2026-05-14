// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ZKSYNC_L2_TX_BATCH_STATUSES } from 'types/api/zkSyncL2';

import config from 'configs/app';

const feature = config.features.rollup;

export const layerLabels = feature.isEnabled ? {
  current: `L${ feature.layerNumber }`,
  parent: `L${ feature.layerNumber - 1 }`,
} : {
  current: 'L2',
  parent: 'L1',
};

export const formatZkSyncL2TxnBatchStatus = (status: typeof ZKSYNC_L2_TX_BATCH_STATUSES[number]) => {
  return status.replace('L2', layerLabels.current).replace('L1', layerLabels.parent);
};
