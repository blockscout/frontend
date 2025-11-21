import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoAssetValue from 'ui/shared/DetailedInfo/DetailedInfoAssetValue';

import TxDetailsGasUsage from './TxDetailsGasUsage';

interface Props {
  data: Transaction;
}

const TxDetailsSetMaxGasLimit = ({ data }: Props) => {
  if (!config.UI.views.tx.additionalFields?.set_max_gas_limit) {
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
      <DetailedInfoAssetValue
        amount={ maxGasLimit.toString() }
        asset={ currencyUnits.ether }
        decimals={ String(config.chain.currency.decimals) }
        exchangeRate={ 'exchange_rate' in data ? data.exchange_rate : null }
        gweiValue
        noTooltip={ false }
      />
      <TxDetailsGasUsage data={ data }/>
    </>
  );
};

export default React.memo(TxDetailsSetMaxGasLimit);
