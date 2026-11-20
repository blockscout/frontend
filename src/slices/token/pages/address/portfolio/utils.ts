// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import { groupBy } from 'es-toolkit';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { AddressFungibleTokensItem } from 'src/slices/token/pages/address/types';
import { isFungibleTokenType } from 'src/slices/token/utils/token-types';

import { getUiMultiplier } from 'src/slices/token/utils/ui-multiplier';

import { clusterConfig } from 'src/shared/external-chains/cluster-config';

import { ZERO } from 'src/toolkit/utils/consts';
import { hairsp } from 'src/toolkit/utils/htmlEntities';

export function formatPercentage(percentage: number) {
  const value = Math.round(percentage * 100);
  if (value === 0 && percentage > 0) {
    return `<${ hairsp }1%`;
  }
  if (value === 100 && percentage < 1) {
    return `>${ hairsp }99%`;
  }
  return `${ value }%`;
}

// An address-portfolio token item belongs to exactly one chain, the single key of `chain_values`.
// An item without `chain_values` is a token of the current chain.
export const getTokenChain = (data: Pick<AddressFungibleTokensItem, 'chain_values'>): ClusterChainConfig | undefined => {
  if (!data.chain_values) {
    return;
  }

  const chainId = Object.keys(data.chain_values)[0];
  return clusterConfig()?.chains.find((chain) => chain.id === chainId);
};

export const calculateUsdValue = (data: AddressFungibleTokensItem) => {
  const isFungibleToken = isFungibleTokenType(data.token?.type);

  if (!isFungibleToken) {
    return;
  }

  const exchangeRate = data.token?.exchange_rate;
  if (!exchangeRate) {
    return;
  }

  const decimals = Number(data.token?.decimals || '18');
  const multiplier = getUiMultiplier(data.token, getTokenChain(data)?.app_config);
  const value = BigNumber(data.value ?? '0').div(BigNumber(10 ** decimals));
  return {
    usd: (multiplier ? value.times(multiplier) : value).multipliedBy(BigNumber(exchangeRate)),
  };
};

export interface TopToken {
  readonly symbol: string;
  readonly share: number;
}

export interface TokenHolding {
  readonly symbol: string;
  readonly usd: BigNumber | undefined;
}

export const OTHERS_SYMBOL = 'Others';

const MAX_TOP_TOKENS = 2;

export const getTopTokens = (holdings: ReadonlyArray<TokenHolding> | undefined, totalUsd: BigNumber): Array<TopToken> | undefined => {
  if (holdings?.length === 0) {
    return;
  }

  if (totalUsd.isZero()) {
    const [ onlyHolding ] = holdings?.length === 1 ? holdings : [];
    return [ { symbol: onlyHolding?.symbol ?? OTHERS_SYMBOL, share: 1 } ];
  }

  const top = Object.entries(groupBy(holdings ?? [], (item) => item.symbol))
    .map(([ symbol, items ]) => ({
      symbol,
      usd: items.reduce((result, item) => result.plus(item.usd ?? ZERO), ZERO),
    }))
    .filter((item) => item.usd.gt(0))
    .sort((a, b) => b.usd.comparedTo(a.usd) ?? 0)
    .slice(0, MAX_TOP_TOKENS);

  const othersUsd = top.reduce((result, item) => result.minus(item.usd), totalUsd);

  return [ ...top, ...(othersUsd.gt(0) ? [ { symbol: OTHERS_SYMBOL, usd: othersUsd } ] : []) ]
    .map((item) => ({ symbol: item.symbol, share: item.usd.div(totalUsd).toNumber() }));
};
