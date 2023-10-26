import { Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';
import type { ExcludeUndefined } from 'types/utils';

import getCurrencyValue from 'lib/getCurrencyValue';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  data: ExcludeUndefined<Transaction['stability_fee']>;
  isLoading?: boolean;
  hideUsd?: boolean;
  accuracy?: number;
  className?: string;
}

const TxFeeStability = ({ data, isLoading, hideUsd, accuracy, className }: Props) => {

  const { valueStr, usd } = getCurrencyValue({
    value: data.total_fee,
    exchangeRate: data.token.exchange_rate,
    decimals: data.token.decimals,
    accuracy,
  });

  return (
    <Skeleton whiteSpace="pre" isLoaded={ !isLoading } display="flex" className={ className }>
      <span>{ valueStr } </span>
      { valueStr !== '0' && <TokenEntity token={ data.token } noIcon noCopy onlySymbol w="auto"/> }
      { usd && !hideUsd && <chakra.span color="text_secondary"> (${ usd })</chakra.span> }
    </Skeleton>
  );
};

export default React.memo(chakra(TxFeeStability));
