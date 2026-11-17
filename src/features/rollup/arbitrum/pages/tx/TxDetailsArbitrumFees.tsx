// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoNativeCoinValue from 'src/shared/detailed-info/DetailedInfoNativeCoinValue';

const rollupFeature = config.features.rollup;
const isArbitrum = rollupFeature.isEnabled && rollupFeature.type === 'arbitrum';

interface Props {
  data: Pick<schemas['TransactionResponse'], 'arbitrum' | 'exchange_rate' | 'historic_exchange_rate'>;
  isLoading: boolean;
}

const TxDetailsArbitrumFees = ({ data, isLoading }: Props) => {
  if (!isArbitrum || !data.arbitrum) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ `Fee paid to the poster for ${ layerLabels.parent } resources` }
        isLoading={ isLoading }
      >
        Poster fee
      </DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue
        amount={ data.arbitrum.poster_fee }
        exchangeRate={ data.exchange_rate }
        historicalExchangeRate={ data.historic_exchange_rate }
        hasExchangeRateToggle
        loading={ isLoading }
      />

      <DetailedInfo.ItemLabel
        hint={ `Fee paid to the network for ${ layerLabels.current } resources` }
        isLoading={ isLoading }
      >
        Network fee
      </DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue
        amount={ data.arbitrum.network_fee }
        exchangeRate={ data.exchange_rate }
        historicalExchangeRate={ data.historic_exchange_rate }
        hasExchangeRateToggle
        loading={ isLoading }
      />
    </>
  );
};

export default React.memo(TxDetailsArbitrumFees);
