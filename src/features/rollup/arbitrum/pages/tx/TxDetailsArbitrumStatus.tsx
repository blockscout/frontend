// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import * as arbitrum from 'src/features/rollup/arbitrum/utils/batch-verification';
import { layerLabels } from 'src/features/rollup/common/utils/layer';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import VerificationSteps from 'src/shared/lifecycle/steps/VerificationSteps';

interface Props {
  data: Pick<schemas['TransactionResponse'], 'arbitrum'>;
  isLoading: boolean;
}

const TxDetailsArbitrumStatus = ({ data, isLoading }: Props) => {
  if (!data.arbitrum?.status || config.slices.tx.hiddenFields?.L1_status) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ `Status of the transaction confirmation path to ${ layerLabels.parent }` }
        isLoading={ isLoading }
      >
        { layerLabels.parent } status
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <VerificationSteps
          currentStep={ arbitrum.VERIFICATION_STEPS_MAP[data.arbitrum.status] }
          currentStepPending={ arbitrum.getVerificationStepStatus(data.arbitrum) === 'pending' }
          steps={ arbitrum.verificationSteps }
          isLoading={ isLoading }
        />
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsArbitrumStatus);
