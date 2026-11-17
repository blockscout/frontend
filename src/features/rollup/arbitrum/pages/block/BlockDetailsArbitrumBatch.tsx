// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import BatchEntityL2 from 'src/features/rollup/common/components/BatchEntityL2';
import { layerLabels } from 'src/features/rollup/common/utils/layer';
import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

const rollupFeature = config.features.rollup;
const isArbitrum = rollupFeature.isEnabled && rollupFeature.type === 'arbitrum';

interface Props {
  data: Pick<schemas['BlockResponse'], 'arbitrum'>;
  isLoading: boolean;
}

const BlockDetailsArbitrumBatch = ({ data, isLoading }: Props) => {
  if (!isArbitrum || !data.arbitrum) {
    return null;
  }

  return (
    <>
      { typeof data.arbitrum.l1_block_number === 'number' && (
        <>
          <DetailedInfo.ItemLabel
            hint={ `The most recent ${ layerLabels.parent } block height as of this ${ layerLabels.current } block` }
            isLoading={ isLoading }
          >
            { layerLabels.parent } block height
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <BlockEntity isLoading={ isLoading } number={ data.arbitrum.l1_block_number } chain={ parentChain }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { !config.slices.block.hiddenFields?.batch && (
        <>
          <DetailedInfo.ItemLabel
            hint="Batch number"
            isLoading={ isLoading }
          >
            Batch
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.arbitrum.batch_number ?
              <BatchEntityL2 isLoading={ isLoading } number={ data.arbitrum.batch_number }/> :
              <Skeleton loading={ isLoading }>Pending</Skeleton> }
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default React.memo(BlockDetailsArbitrumBatch);
