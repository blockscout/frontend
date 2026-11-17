// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import BatchEntityL2 from 'src/features/rollup/common/components/BatchEntityL2';
import OptimisticL2TxnBatchDA from 'src/features/rollup/optimism/components/TxnBatchDA';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

const rollupFeature = config.features.rollup;
const isOptimistic = rollupFeature.isEnabled && rollupFeature.type === 'optimistic';

interface Props {
  data: Pick<schemas['BlockResponse'], 'optimism'>;
  isLoading: boolean;
}

const BlockDetailsOptimismBatch = ({ data, isLoading }: Props) => {
  if (!isOptimistic || !data.optimism || config.slices.block.hiddenFields?.batch) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Batch number"
        isLoading={ isLoading }
      >
        Batch
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue columnGap={ 3 }>
        { data.optimism.number ?
          <BatchEntityL2 isLoading={ isLoading } number={ data.optimism.number }/> :
          <Skeleton loading={ isLoading }>Pending</Skeleton> }
        { data.optimism.batch_data_container && (
          <OptimisticL2TxnBatchDA
            container={ data.optimism.batch_data_container }
            isLoading={ isLoading }
          />
        ) }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(BlockDetailsOptimismBatch);
