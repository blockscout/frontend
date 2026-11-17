// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import BatchEntityL2 from 'src/features/rollup/common/components/BatchEntityL2';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  data: Pick<schemas['TransactionResponse'], 'arbitrum'>;
  isLoading: boolean;
}

const TxDetailsArbitrumBatch = ({ data, isLoading }: Props) => {
  if (!data.arbitrum || config.slices.tx.hiddenFields?.batch) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Index of the batch containing this transaction"
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
  );
};

export default React.memo(TxDetailsArbitrumBatch);
