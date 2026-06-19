// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import TextSeparator from 'src/shared/texts/TextSeparator';
import Utilization from 'src/shared/values/utilization/Utilization';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  isLoading?: boolean;
  data: Pick<schemas['TransactionResponse'], 'gas_used' | 'gas_limit'>;
}

const TxDetailsGasUsage = ({ isLoading, data }: Props) => {
  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Actual gas amount used by the transaction"
        isLoading={ isLoading }
      >
        Gas usage & limit by txn
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading }>{ BigNumber(data.gas_used || 0).toFormat() }</Skeleton>
        <TextSeparator/>
        <Skeleton loading={ isLoading }>{ BigNumber(data.gas_limit).toFormat() }</Skeleton>
        <Utilization ml={ 4 } value={ BigNumber(data.gas_used || 0).dividedBy(BigNumber(data.gas_limit)).toNumber() } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsGasUsage);
