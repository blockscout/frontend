import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import getCurrencyValue from 'lib/getCurrencyValue';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  token: TokenInfo;
  value: string;
  decimals: string | null;
}
const FtTokenTransferSnippet = ({ token, value, decimals }: Props) => {
  const { valueStr, usd } = getCurrencyValue({
    value: value,
    exchangeRate: token.exchange_rate,
    accuracyUsd: 2,
    decimals: decimals,
  });

  return (
    <>
      <chakra.span color="text.secondary">for</chakra.span>
      <span>{ valueStr }</span>
      <TokenEntity
        token={{ ...token, name: token.symbol || token.name }}
        noCopy
        noSymbol
        w="auto"
      />
      { usd && <chakra.span color="text.secondary">(${ usd })</chakra.span> }
    </>
  );
};

export default React.memo(FtTokenTransferSnippet);
