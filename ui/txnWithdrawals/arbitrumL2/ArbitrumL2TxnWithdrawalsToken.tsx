import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2TxnWithdrawalsItem } from 'types/api/arbitrumL2';
import type { TokenInfo } from 'types/api/token';
import type { ExcludeNull } from 'types/utils';

import getCurrencyValue from 'lib/getCurrencyValue';
import TokenEntityL1 from 'ui/shared/entities/token/TokenEntityL1';

interface Props {
  data: ExcludeNull<ArbitrumL2TxnWithdrawalsItem['token']>;
}

const ArbitrumL2TxnWithdrawalsToken = ({ data }: Props) => {
  const { valueStr } = getCurrencyValue({
    value: data.amount ?? '0',
    accuracy: 8,
    decimals: String(data.decimals),
  });

  const formattedData: TokenInfo | null = React.useMemo(() => {
    return {
      ...data,
      decimals: String(data.decimals),
      type: 'ERC-20',
      holders: null,
      exchange_rate: null,
      total_supply: null,
      circulating_market_cap: null,
      icon_url: null,
    };
  }, [ data ]);

  return (
    <Flex alignItems="center" columnGap={ 2 } w="fit-content" ml={{ base: undefined, lg: 'auto' }} color="initial">
      { valueStr }
      <TokenEntityL1 token={ formattedData } noIcon noCopy onlySymbol/>
    </Flex>
  );
};

export default React.memo(ArbitrumL2TxnWithdrawalsToken);
