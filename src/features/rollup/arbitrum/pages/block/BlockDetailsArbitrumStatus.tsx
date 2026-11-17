// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import * as arbitrum from 'src/features/rollup/arbitrum/utils/batch-verification';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import VerificationSteps from 'src/shared/lifecycle/steps/VerificationSteps';

const rollupFeature = config.features.rollup;
const isArbitrum = rollupFeature.isEnabled && rollupFeature.type === 'arbitrum';

interface Props {
  data: Pick<schemas['BlockResponse'], 'arbitrum'>;
  isLoading: boolean;
}

const BlockDetailsArbitrumStatus = ({ data, isLoading }: Props) => {
  if (!isArbitrum || !data.arbitrum || config.slices.block.hiddenFields?.L1_status) {
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
          steps={ arbitrum.verificationSteps }
          currentStep={ arbitrum.VERIFICATION_STEPS_MAP[data.arbitrum.status] }
          currentStepPending={ arbitrum.getVerificationStepStatus(data.arbitrum) === 'pending' }
          isLoading={ isLoading }
        />
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(BlockDetailsArbitrumStatus);
