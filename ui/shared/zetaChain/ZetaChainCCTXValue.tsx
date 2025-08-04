import { Text, chakra } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTXCoinType } from 'types/api/zetaChain';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import { Skeleton } from 'toolkit/chakra/skeleton';

type Props = {
  coinType: ZetaChainCCTXCoinType;
  tokenSymbol?: string;
  amount: string;
  decimals?: string | null;
  isLoading?: boolean;
  className?: string;
};

const ZetaChainCCTXValue = ({ coinType, tokenSymbol, amount, decimals, isLoading, className }: Props) => {
  let unit: string;
  let value: string | undefined;
  switch (coinType) {
    case 'ERC20':
      unit = tokenSymbol || 'Unnamed token';
      value = getCurrencyValue({ value: amount, decimals: decimals || '18' }).valueStr;
      break;
    case 'ZETA':
      unit = config.chain.currency.symbol || config.chain.currency.name || '';
      value = getCurrencyValue({ value: amount, decimals: config.chain.currency.decimals.toString() || '18' }).valueStr;
      break;
    case 'GAS':
      unit = tokenSymbol || 'Unnamed token';
      value = getCurrencyValue({ value: amount, decimals: decimals || '18' }).valueStr;
      break;
    default:
      unit = '-';
      break;
  }

  return (
    <Skeleton loading={ isLoading } display="flex" gap={ 2 } overflow="hidden" className={ className }>
      <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">{ value }</Text>
      <Text color="text.secondary" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{ unit }</Text>
    </Skeleton>
  );
};

export default React.memo(chakra(ZetaChainCCTXValue));
