// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ZKSYNC_L2_TX_BATCH_STATUSES } from 'client/features/rollup/zk-sync/types/api';

import { layerLabels } from 'client/features/rollup/common/utils/layer';

export const formatZkSyncL2TxnBatchStatus = (status: typeof ZKSYNC_L2_TX_BATCH_STATUSES[number]) => {
  return status.replace('L2', layerLabels.current).replace('L1', layerLabels.parent);
};
