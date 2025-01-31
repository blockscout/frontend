import { GridItem, VStack } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2BlobTypeEip4844 } from 'types/api/optimisticL2';

import dayjs from 'lib/date/dayjs';
import BlobEntityL1 from 'ui/shared/entities/blob/BlobEntityL1';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';

import OptimisticL2TxnBatchBlobWrapper from './OptimisticL2TxnBatchBlobWrapper';

interface Props {
  blobs: Array<OptimisticL2BlobTypeEip4844>;
  isLoading: boolean;
}

const OptimisticL2TxnBatchBlobEip4844 = ({ blobs, isLoading }: Props) => {
  return (
    <VStack rowGap={ 2 } w="100%">
      { blobs.map((blob) => {
        return (
          <OptimisticL2TxnBatchBlobWrapper key={ blob.hash } isLoading={ isLoading }>
            <GridItem fontWeight={ 600 }>Versioned hash</GridItem>
            <GridItem overflow="hidden">
              <BlobEntityL1 hash={ blob.hash }/>
            </GridItem>
            <GridItem fontWeight={ 600 }>Timestamp</GridItem>
            <GridItem whiteSpace="normal">
              { dayjs(blob.l1_timestamp).fromNow() } | { dayjs(blob.l1_timestamp).format('llll') }
            </GridItem>
            <GridItem fontWeight={ 600 }>L1 txn hash</GridItem>
            <GridItem overflow="hidden">
              <TxEntityL1 hash={ blob.l1_transaction_hash } noIcon noCopy={ false }/>
            </GridItem>
          </OptimisticL2TxnBatchBlobWrapper>
        );
      }) }
    </VStack>

  );
};

export default React.memo(OptimisticL2TxnBatchBlobEip4844);
