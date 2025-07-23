import { Text } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTX } from 'types/api/zetaChain';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import { Skeleton } from 'toolkit/chakra/skeleton';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

const ZetaChainCCTXValue = ({ tx, isLoading }: { tx: ZetaChainCCTX; isLoading?: boolean }) => {
  const { data: chainsConfig } = useZetaChainConfig();
  const sourceChain = chainsConfig?.find((chain) => chain.chain_id.toString() === tx.source_chain_id);
  let unit: string;
  let amount: string | undefined;
  switch (tx.coin_type) {
    case 'ERC20':
      unit = tx.token_symbol || 'Unnamed token';
      // replace with decimals from token info
      amount = getCurrencyValue({ value: tx.amount, decimals: '18' }).valueStr;
      break;
    case 'ZETA':
      unit = config.chain.currency.symbol || config.chain.currency.name || '';
      amount = getCurrencyValue({ value: tx.amount, decimals: config.chain.currency.decimals.toString() || '18' }).valueStr;
      break;
    case 'GAS':
      unit = sourceChain?.native_currency.symbol || 'Unknown';
      amount = getCurrencyValue({ value: tx.amount, decimals: sourceChain?.native_currency.decimals.toString() || '18' }).valueStr;
      break;
    default:
      unit = '-';
      break;
  }

  return (
    <Skeleton loading={ isLoading } display="flex" justifyContent="end" gap={ 2 } overflow="hidden">
      <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">{ amount }</Text>
      <Text color="text.secondary" minW="70px" w="70px" overflow="hidden" textOverflow="ellipsis">{ unit }</Text>
    </Skeleton>
  );
};

export default React.memo(ZetaChainCCTXValue);
