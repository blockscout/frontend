import { GridItem } from '@chakra-ui/react';
import React from 'react';

import dayjs from 'lib/date/dayjs';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';

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
      <GridItem whiteSpace="normal">
        { dayjs(l1Timestamp).fromNow() } | { dayjs(l1Timestamp).format('llll') }
      </GridItem>
      <GridItem fontWeight={ 600 }>L1 txn hash{ l1TxHashes.length > 1 ? 'es' : '' }</GridItem>
      <GridItem overflow="hidden" display="flex" flexDir="column" rowGap={ 2 }>
        { l1TxHashes.map((hash) => <TxEntityL1 key={ hash } hash={ hash } noIcon noCopy={ false }/>) }
      </GridItem>
    </OptimisticL2TxnBatchBlobWrapper>

  );
};

export default React.memo(OptimisticL2TxnBatchBlobCallData);
