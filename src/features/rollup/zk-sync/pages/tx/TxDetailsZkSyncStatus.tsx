// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import { ZKSYNC_L2_TX_BATCH_STATUSES } from 'src/features/rollup/zk-sync/types/api';

import { layerLabels } from 'src/features/rollup/common/utils/layer';
import { formatZkSyncL2TxnBatchStatus } from 'src/features/rollup/zk-sync/utils/format-txn-batch-status';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import VerificationSteps from 'src/shared/lifecycle/steps/VerificationSteps';

const ZKSYNC_L2_TX_STATUS_STEPS = ZKSYNC_L2_TX_BATCH_STATUSES.map(formatZkSyncL2TxnBatchStatus);

interface Props {
  data: Pick<schemas['TransactionResponse'], 'zksync'>;
  isLoading: boolean;
}

const TxDetailsZkSyncStatus = ({ data, isLoading }: Props) => {
  if (config.slices.tx.hiddenFields?.L1_status || !data.zksync?.status) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Status is the short interpretation of the batch lifecycle"
        isLoading={ isLoading }
      >
        { layerLabels.parent } status
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <VerificationSteps
          steps={ ZKSYNC_L2_TX_STATUS_STEPS }
          currentStep={ formatZkSyncL2TxnBatchStatus(data.zksync.status) }
          isLoading={ isLoading }
        />
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsZkSyncStatus);
