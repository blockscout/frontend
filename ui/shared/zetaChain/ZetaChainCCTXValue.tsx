import { Text, chakra } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTX } from 'types/api/zetaChain';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import { Skeleton } from 'toolkit/chakra/skeleton';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

const ZetaChainCCTXValue = ({ tx, isLoading, className }: { tx: ZetaChainCCTX; isLoading?: boolean; className?: string }) => {
  const { data: chainsConfig } = useZetaChainConfig();
  const sourceChain = chainsConfig?.find((chain) => chain.chain_id.toString() === tx.source_chain_id);
  let unit: string;
  let amount: string | undefined;
  switch (tx.coin_type) {
    case 'ERC20':
      unit = tx.token_symbol || 'Unnamed token';
      amount = getCurrencyValue({ value: tx.amount, decimals: tx.decimals }).valueStr;
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
    <Skeleton loading={ isLoading } display="flex" gap={ 2 } overflow="hidden" className={ className }>
      <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">{ amount }</Text>
      <Text color="text.secondary" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{ unit }</Text>
    </Skeleton>
  );
};

export default React.memo(chakra(ZetaChainCCTXValue));
