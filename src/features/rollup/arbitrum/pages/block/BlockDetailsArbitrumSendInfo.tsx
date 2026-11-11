// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

const rollupFeature = config.features.rollup;
const isArbitrum = rollupFeature.isEnabled && rollupFeature.type === 'arbitrum';

interface Props {
  data: Pick<schemas['BlockResponse'], 'arbitrum'>;
  isLoading: boolean;
}

const BlockDetailsArbitrumSendInfo = ({ data, isLoading }: Props) => {
  if (!isArbitrum || !data.arbitrum || typeof data.arbitrum.send_count !== 'number') {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ `The cumulative number of ${ layerLabels.current } to ${ layerLabels.parent } transactions as of this block` }
        isLoading={ isLoading }
      >
        Send count
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { data.arbitrum.send_count.toLocaleString() }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ `The root of the Merkle accumulator representing all ${ layerLabels.current } to ${ layerLabels.parent } transactions as of this block` }
        isLoading={ isLoading }
      >
        Send root
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { data.arbitrum.send_root }
      </DetailedInfo.ItemValue>

      { data.arbitrum.delayed_messages !== undefined && (
        <>
          <DetailedInfo.ItemLabel
            hint={ `The number of delayed ${ layerLabels.parent } to ${ layerLabels.current } messages read as of this block` }
            isLoading={ isLoading }
          >
            Delayed messages
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.arbitrum.delayed_messages.toLocaleString() }
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default React.memo(BlockDetailsArbitrumSendInfo);
