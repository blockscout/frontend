// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'src/slices/tx/types/api';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoNativeCoinValue from 'src/shared/detailed-info/DetailedInfoNativeCoinValue';

import TxDetailsGasUsage from './TxDetailsGasUsage';

interface Props {
  data: Transaction;
}

const TxDetailsSetMaxGasLimit = ({ data }: Props) => {
  if (!config.slices.tx.additionalFields?.set_max_gas_limit) {
    return null;
  }

  const maxGasLimit = BigNumber(data.gas_limit || 0).multipliedBy(BigNumber(data.gas_price || 0));

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="The maximum network fee the sender is willing to pay for this transaction"
      >
        User’s set max gas limit
      </DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue
        amount={ maxGasLimit.toString() }
        exchangeRate={ 'exchange_rate' in data ? data.exchange_rate : null }
        historicalExchangeRate={ 'historic_exchange_rate' in data ? data.historic_exchange_rate : null }
        hasExchangeRateToggle
        unitsTooltip="gwei"
        copyOriginalValue
      />
      <TxDetailsGasUsage data={ data }/>
    </>
  );
};

export default React.memo(TxDetailsSetMaxGasLimit);
