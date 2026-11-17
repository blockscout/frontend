// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  data: Pick<schemas['TransactionResponse'], 'scroll'>;
  isLoading: boolean;
}

const TxDetailsScrollL1GasUsed = ({ data, isLoading }: Props) => {
  if (data.scroll?.l1_gas_used === undefined || config.slices.tx.hiddenFields?.L1_gas_used) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ `Total gas used on ${ layerLabels.parent }` }
        isLoading={ isLoading }
      >
        { layerLabels.parent } Gas used
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading }>{ BigNumber(data.scroll.l1_gas_used || 0).toFormat() }</Skeleton>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsScrollL1GasUsed);
