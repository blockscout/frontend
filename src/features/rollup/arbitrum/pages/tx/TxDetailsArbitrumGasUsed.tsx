// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import TextSeparator from 'src/shared/texts/TextSeparator';
import Utilization from 'src/shared/values/utilization/Utilization';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

const rollupFeature = config.features.rollup;
const isArbitrum = rollupFeature.isEnabled && rollupFeature.type === 'arbitrum';

interface Props {
  data: Pick<schemas['TransactionResponse'], 'arbitrum' | 'gas_used'>;
  isLoading: boolean;
}

const TxDetailsArbitrumGasUsed = ({ data, isLoading }: Props) => {
  if (!isArbitrum || !data.arbitrum || !data.gas_used) {
    return null;
  }

  const gasUsedForL1 = BigNumber(data.arbitrum.gas_used_for_l1 || 0);
  const gasUsedForL2 = BigNumber(data.arbitrum.gas_used_for_l2 || 0);
  const gasUsed = BigNumber(data.gas_used);

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ `${ layerLabels.current } gas set aside for ${ layerLabels.parent } data charges` }
        isLoading={ isLoading }
      >
        Gas used for { layerLabels.parent }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading }>{ gasUsedForL1.toFormat() }</Skeleton>
        <TextSeparator/>
        <Utilization
          ml={ 4 }
          value={ gasUsedForL1.dividedBy(gasUsed).toNumber() }
          isLoading={ isLoading }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ `${ layerLabels.current } gas spent on ${ layerLabels.current } resources` }
        isLoading={ isLoading }
      >
        Gas used for { layerLabels.current }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading }>{ gasUsedForL2.toFormat() }</Skeleton>
        <TextSeparator/>
        <Utilization
          ml={ 4 }
          value={ gasUsedForL2.dividedBy(gasUsed).toNumber() }
          isLoading={ isLoading }
        />
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsArbitrumGasUsed);
