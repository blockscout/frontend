// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, GridItem, VStack } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import { layerLabels } from 'src/features/rollup/common/utils/layer';
import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

import DetailedInfoTimestamp from 'src/shared/detailed-info/DetailedInfoTimestamp';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';

import { Truncate } from 'src/toolkit/components/truncation/Truncate';

import OptimisticL2TxnBatchBlobWrapper from './OptimisticL2TxnBatchBlobWrapper';

interface Props {
  blobs: schemas['OptimismBatchInEigenda']['blobs'];
  isLoading: boolean;
}

const OptimisticL2TxnBatchBlobEigenda = ({ blobs, isLoading }: Props) => {
  return (
    <VStack rowGap={ 2 } w="100%">
      { blobs.map((blob) => {
        return (
          <OptimisticL2TxnBatchBlobWrapper key={ blob.cert } isLoading={ isLoading }>
            <GridItem fontWeight={ 600 }>Cert</GridItem>
            <GridItem overflow="hidden">
              <Flex minW="0" w="calc(100% - 20px)">
                <Truncate value={ blob.cert }/>
                <CopyToClipboard text={ blob.cert }/>
              </Flex>
            </GridItem>
            <GridItem fontWeight={ 600 }>Timestamp</GridItem>
            <GridItem overflow="hidden">
              <DetailedInfoTimestamp timestamp={ blob.l1_timestamp } isLoading={ isLoading } flexWrap={{ base: 'wrap', lg: 'nowrap' }}/>
            </GridItem>
            <GridItem fontWeight={ 600 }>{ layerLabels.parent } txn hash</GridItem>
            <GridItem overflow="hidden">
              <TxEntity hash={ blob.l1_transaction_hash } noIcon chain={ parentChain }/>
            </GridItem>
          </OptimisticL2TxnBatchBlobWrapper>
        );
      }) }
    </VStack>

  );
};

export default React.memo(OptimisticL2TxnBatchBlobEigenda);
