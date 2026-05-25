// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'client/slices/tx/types/api';

import { currencyUnits } from 'client/slices/chain/units';

import * as DetailedInfo from 'client/shared/detailed-info/DetailedInfo';
import DetailedInfoNativeCoinValue from 'client/shared/detailed-info/DetailedInfoNativeCoinValue';
import SpriteIcon from 'client/sprite/SpriteIcon';

import config from 'configs/app';
import { ZERO } from 'toolkit/utils/consts';

const rollupFeature = config.features.rollup;

interface Props {
  data: Transaction;
  isLoading?: boolean;
}

const TxDetailsBurntFees = ({ data, isLoading }: Props) => {

  if (config.UI.views.tx.hiddenFields?.burnt_fees || (rollupFeature.isEnabled && rollupFeature.type === 'optimistic')) {
    return null;
  }

  const value = BigNumber(data.transaction_burnt_fee || 0).plus(BigNumber(data.blob_gas_used || 0).multipliedBy(BigNumber(data.blob_gas_price || 0)));

  if (value.isEqualTo(ZERO)) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ `
            Amount of ${ currencyUnits.ether } burned for this transaction. Equals Block Base Fee per Gas * Gas Used
            ${ data.blob_gas_price && data.blob_gas_used ? ' + Blob Gas Price * Blob Gas Used' : '' }
          ` }
        isLoading={ isLoading }
      >
        Burnt fees
      </DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue
        amount={ value.toString() }
        exchangeRate={ data.exchange_rate }
        historicalExchangeRate={ data.historic_exchange_rate }
        hasExchangeRateToggle
        startElement={ <SpriteIcon name="flame" boxSize={ 5 } color="icon.primary" isLoading={ isLoading } mr={{ base: 0, lg: 1 }}/> }
        loading={ isLoading }
      />
    </>
  );
};

export default React.memo(TxDetailsBurntFees);
