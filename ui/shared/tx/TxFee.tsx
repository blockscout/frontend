import type { BoxProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { Transaction, WrappedTransactionFields } from 'types/api/transaction';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import AssetValue from 'ui/shared/value/AssetValue';
import TokenValue from 'ui/shared/value/TokenValue';

interface Props extends BoxProps {
  isLoading?: boolean;
  tx: Transaction | Pick<Transaction, WrappedTransactionFields>;
  withCurrency?: boolean;
  withUsd?: boolean;
  accuracy?: number;
  accuracyUsd?: number;
  noTooltip?: boolean;
}

const TxFee = ({ tx, accuracy, accuracyUsd, isLoading, withCurrency = true, withUsd, noTooltip, ...rest }: Props) => {

  if ('celo' in tx && tx.celo?.gas_token) {
    return (
      <TokenValue
        amount={ tx.fee.value || '0' }
        token={ tx.celo.gas_token }
        accuracy={ accuracy }
        accuracyUsd={ accuracyUsd }
        loading={ isLoading }
        { ...rest }
      />
    );
  }

  if ('stability_fee' in tx && tx.stability_fee) {
    return (
      <TokenValue
        amount={ tx.stability_fee.total_fee }
        token={ tx.stability_fee.token }
        accuracy={ accuracy }
        accuracyUsd={ accuracyUsd }
        loading={ isLoading }
        { ...rest }
      />
    );
  }

  const showCurrency = withCurrency && !config.UI.views.tx.hiddenFields?.fee_currency;

  return (
    <AssetValue
      amount={ tx.fee.value || '0' }
      asset={ showCurrency ? currencyUnits.ether : '' }
      decimals={ String(config.chain.currency.decimals) }
      exchangeRate={ withUsd && 'exchange_rate' in tx ? tx.exchange_rate : null }
      accuracy={ accuracy }
      accuracyUsd={ accuracyUsd }
      loading={ isLoading }
      noTooltip={ noTooltip }
      flexWrap="wrap"
      { ...rest }
    />
  );
};

export default React.memo(chakra(TxFee));
