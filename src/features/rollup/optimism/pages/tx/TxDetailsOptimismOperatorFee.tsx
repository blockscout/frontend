// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoNativeCoinValue from 'src/shared/detailed-info/DetailedInfoNativeCoinValue';

const rollupFeature = config.features.rollup;
const isOptimistic = rollupFeature.isEnabled && rollupFeature.type === 'optimistic';

interface Props {
  data: Pick<schemas['TransactionResponse'], 'operator_fee' | 'exchange_rate' | 'historic_exchange_rate'>;
  isLoading: boolean;
}

const TxDetailsOptimismOperatorFee = ({ data, isLoading }: Props) => {
  if (!isOptimistic || !data.operator_fee) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="A fee set by the chain operator to cover extra costs of additional services"
      >
        Operator fee
      </DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue
        amount={ data.operator_fee }
        exchangeRate={ data.exchange_rate }
        historicalExchangeRate={ data.historic_exchange_rate }
        hasExchangeRateToggle
        loading={ isLoading }
      />
    </>
  );
};

export default React.memo(TxDetailsOptimismOperatorFee);
