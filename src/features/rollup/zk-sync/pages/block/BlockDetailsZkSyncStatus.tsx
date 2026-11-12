// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import { ZKSYNC_L2_TX_BATCH_STATUSES } from 'src/features/rollup/zk-sync/types/api';

import { formatZkSyncL2TxnBatchStatus } from 'src/features/rollup/zk-sync/utils/format-txn-batch-status';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import VerificationSteps from 'src/shared/lifecycle/steps/VerificationSteps';

const rollupFeature = config.features.rollup;
const isZkSync = rollupFeature.isEnabled && rollupFeature.type === 'zkSync';

const verificationSteps = ZKSYNC_L2_TX_BATCH_STATUSES.map(formatZkSyncL2TxnBatchStatus);

interface Props {
  data: Pick<schemas['BlockResponse'], 'zksync'>;
  isLoading: boolean;
}

const BlockDetailsZkSyncStatus = ({ data, isLoading }: Props) => {
  if (!isZkSync || !data.zksync || config.slices.block.hiddenFields?.L1_status) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Status is the short interpretation of the batch lifecycle"
        isLoading={ isLoading }
      >
        Status
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <VerificationSteps
          steps={ verificationSteps }
          currentStep={ formatZkSyncL2TxnBatchStatus(data.zksync.status) }
          isLoading={ isLoading }
        />
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(BlockDetailsZkSyncStatus);
