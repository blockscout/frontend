import type { BoxProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { Transaction, WrappedTransactionFields } from 'types/api/transaction';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import AssetValue from 'ui/shared/value/AssetValue';

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

  // TODO @tom2drum check celo and stability cases
  if ('celo' in tx && tx.celo?.gas_token) {
    const token = tx.celo.gas_token;
    const { valueStr, usd } = getCurrencyValue({
      value: tx.fee.value || '0',
      exchangeRate: token.exchange_rate,
      decimals: token.decimals,
      accuracy,
      accuracyUsd,
    });
    return (
      <Skeleton whiteSpace="pre-wrap" wordBreak="break-word" loading={ isLoading } display="flex" flexWrap="wrap" { ...rest }>
        <span>{ valueStr } </span>
        <TokenEntity token={ token } noCopy onlySymbol w="auto" ml={ 1 }/>
        { usd && withUsd && <chakra.span color="text.secondary"> (${ usd })</chakra.span> }
      </Skeleton>
    );
  }

  if ('stability_fee' in tx && tx.stability_fee) {
    const token = tx.stability_fee.token;
    const { valueStr, usd } = getCurrencyValue({
      value: tx.stability_fee.total_fee,
      exchangeRate: token.exchange_rate,
      decimals: token.decimals,
      accuracy,
      accuracyUsd,
    });

    return (
      <Skeleton whiteSpace="pre" loading={ isLoading } display="flex" { ...rest }>
        <span>{ valueStr } </span>
        { valueStr !== '0' && <TokenEntity token={ token } noCopy onlySymbol w="auto" ml={ 1 }/> }
        { usd && withUsd && <chakra.span color="text.secondary"> (${ usd })</chakra.span> }
      </Skeleton>
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
      flexWrap="wrap"
      loading={ isLoading }
      noTooltip={ noTooltip }
      { ...rest }
    />
  );
};

export default React.memo(chakra(TxFee));
