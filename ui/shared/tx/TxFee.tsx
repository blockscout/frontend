import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import { currencyUnits } from 'lib/units';
import Skeleton from 'ui/shared/chakra/Skeleton';
import CurrencyValue from 'ui/shared/CurrencyValue';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  className?: string;
  isLoading?: boolean;
  tx: Transaction;
  withCurrency?: boolean;
  withUsd?: boolean;
  accuracy?: number;
  accuracyUsd?: number;
}

const TxFee = ({ className, tx, accuracy, accuracyUsd, isLoading, withCurrency = true, withUsd }: Props) => {

  if (tx.celo?.gas_token) {
    const token = tx.celo.gas_token;
    const { valueStr, usd } = getCurrencyValue({
      value: tx.fee.value || '0',
      exchangeRate: token.exchange_rate,
      decimals: token.decimals,
      accuracy,
      accuracyUsd,
    });
    return (
      <Skeleton whiteSpace="pre-wrap" wordBreak="break-word" isLoaded={ !isLoading } display="flex" flexWrap="wrap" className={ className }>
        <span>{ valueStr } </span>
        <TokenEntity token={ token } noCopy onlySymbol w="auto" ml={ 1 }/>
        { usd && withUsd && <chakra.span color="text_secondary"> (${ usd })</chakra.span> }
      </Skeleton>
    );
  }

  if (tx.stability_fee) {
    const token = tx.stability_fee.token;
    const { valueStr, usd } = getCurrencyValue({
      value: tx.stability_fee.total_fee,
      exchangeRate: token.exchange_rate,
      decimals: token.decimals,
      accuracy,
      accuracyUsd,
    });

    return (
      <Skeleton whiteSpace="pre" isLoaded={ !isLoading } display="flex" className={ className }>
        <span>{ valueStr } </span>
        { valueStr !== '0' && <TokenEntity token={ token } noCopy onlySymbol w="auto" ml={ 1 }/> }
        { usd && withUsd && <chakra.span color="text_secondary"> (${ usd })</chakra.span> }
      </Skeleton>
    );
  }

  const showCurrency = withCurrency && !config.UI.views.tx.hiddenFields?.fee_currency;

  return (
    <CurrencyValue
      value={ tx.fee.value }
      currency={ showCurrency ? currencyUnits.ether : '' }
      exchangeRate={ withUsd ? tx.exchange_rate : null }
      accuracy={ accuracy }
      accuracyUsd={ accuracyUsd }
      flexWrap="wrap"
      className={ className }
      isLoading={ isLoading }
    />
  );
};

export default React.memo(chakra(TxFee));
