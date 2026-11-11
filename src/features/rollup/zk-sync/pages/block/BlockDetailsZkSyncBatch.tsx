// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import BatchEntityL2 from 'src/features/rollup/common/components/BatchEntityL2';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

const rollupFeature = config.features.rollup;
const isZkSync = rollupFeature.isEnabled && rollupFeature.type === 'zkSync';

interface Props {
  data: Pick<schemas['BlockResponse'], 'zksync'>;
  isLoading: boolean;
}

const BlockDetailsZkSyncBatch = ({ data, isLoading }: Props) => {
  if (!isZkSync || !data.zksync || config.slices.block.hiddenFields?.batch) {
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
      <DetailedInfo.ItemValue>
        { data.zksync.batch_number ?
          <BatchEntityL2 isLoading={ isLoading } number={ data.zksync.batch_number }/> :
          <Skeleton loading={ isLoading }>Pending</Skeleton> }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(BlockDetailsZkSyncBatch);
