import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2TxnWithdrawalsItem } from 'types/api/arbitrumL2';
import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import TokenEntityL1 from 'ui/shared/entities/token/TokenEntityL1';

interface Props {
  data: ArbitrumL2TxnWithdrawalsItem;
}

const ArbitrumL2TxnWithdrawalsValue = ({ data }: Props) => {

  const content = (() => {
    if (data.token) {
      const { valueStr } = data.token && getCurrencyValue({
        value: data.token.amount ?? '0',
        accuracy: 8,
        decimals: String(data.token.decimals),
      });

      const formattedData: TokenInfo | null = {
        ...data.token,
        decimals: String(data.token.decimals),
        type: 'ERC-20',
        holders_count: null,
        exchange_rate: null,
        total_supply: null,
        circulating_market_cap: null,
        icon_url: null,
      };

      return (
        <>
          { valueStr }
          <TokenEntityL1 token={ formattedData } noIcon noCopy onlySymbol/>
        </>
      );
    }

    if (data.callvalue && data.callvalue !== '0') {
      const { valueStr } = getCurrencyValue({
        value: data.callvalue,
        accuracy: 8,
        decimals: String(config.chain.currency.decimals),
      });

      return (
        <>
          <span>{ valueStr }</span>
          <span>{ config.chain.currency.symbol }</span>
        </>
      );
    }

    return <span>-</span>;
  })();

  return (
    <Flex alignItems="center" columnGap={ 1 } w="fit-content" ml={{ base: undefined, lg: 'auto' }} color="initial">
      { content }
    </Flex>
  );
};

export default React.memo(ArbitrumL2TxnWithdrawalsValue);
