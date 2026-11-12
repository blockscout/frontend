// SPDX-License-Identifier: LicenseRef-Blockscout

import { GridItem } from '@chakra-ui/react';
import React from 'react';

import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import { layerLabels } from 'src/features/rollup/common/utils/layer';
import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

import DetailedInfoTimestamp from 'src/shared/detailed-info/DetailedInfoTimestamp';

import OptimisticL2TxnBatchBlobWrapper from './OptimisticL2TxnBatchBlobWrapper';

interface Props {
  l1TxHashes: Array<string>;
  l1Timestamp: string;
  isLoading: boolean;
}

const OptimisticL2TxnBatchBlobCallData = ({ l1TxHashes, l1Timestamp, isLoading }: Props) => {
  return (
    <OptimisticL2TxnBatchBlobWrapper isLoading={ isLoading }>
      <GridItem fontWeight={ 600 }>Timestamp</GridItem>
      <GridItem overflow="hidden">
        <DetailedInfoTimestamp timestamp={ l1Timestamp } isLoading={ isLoading } flexWrap={{ base: 'wrap', lg: 'nowrap' }}/>
      </GridItem>
      <GridItem fontWeight={ 600 }>{ layerLabels.parent } txn hash{ l1TxHashes.length > 1 ? 'es' : '' }</GridItem>
      <GridItem overflow="hidden" display="flex" flexDir="column" rowGap={ 2 }>
        { l1TxHashes.map((hash) => <TxEntity key={ hash } hash={ hash } noIcon chain={ parentChain }/>) }
      </GridItem>
    </OptimisticL2TxnBatchBlobWrapper>

  );
};

export default React.memo(OptimisticL2TxnBatchBlobCallData);
