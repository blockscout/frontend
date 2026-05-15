// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, GridItem, VStack } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2BlobTypeEigenda } from 'client/features/rollup/optimism/types/api';

import TxEntityL1 from 'client/features/rollup/common/components/TxEntityL1';
import { layerLabels } from 'client/features/rollup/common/utils/layer';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

import OptimisticL2TxnBatchBlobWrapper from './OptimisticL2TxnBatchBlobWrapper';

interface Props {
  blobs: Array<OptimisticL2BlobTypeEigenda>;
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
                <HashStringShortenDynamic hash={ blob.cert }/>
                <CopyToClipboard text={ blob.cert }/>
              </Flex>
            </GridItem>
            <GridItem fontWeight={ 600 }>Timestamp</GridItem>
            <GridItem overflow="hidden">
              <DetailedInfoTimestamp timestamp={ blob.l1_timestamp } isLoading={ isLoading } flexWrap={{ base: 'wrap', lg: 'nowrap' }}/>
            </GridItem>
            <GridItem fontWeight={ 600 }>{ layerLabels.parent } txn hash</GridItem>
            <GridItem overflow="hidden">
              <TxEntityL1 hash={ blob.l1_transaction_hash } noIcon/>
            </GridItem>
          </OptimisticL2TxnBatchBlobWrapper>
        );
      }) }
    </VStack>

  );
};

export default React.memo(OptimisticL2TxnBatchBlobEigenda);
