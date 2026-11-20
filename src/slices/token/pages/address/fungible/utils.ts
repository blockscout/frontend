// SPDX-License-Identifier: LicenseRef-Blockscout

import type BigNumber from 'bignumber.js';

import type { TopToken } from '../portfolio/utils';
import { getTopTokens } from '../portfolio/utils';
import type { TokenSelectData } from '../utils';
import { FUNGIBLE_TOKEN_TYPES, getTokensTotalInfo, isNativeToken } from '../utils';

interface NativeCoinHolding {
  readonly symbol: string;
  readonly balance: BigNumber;
  readonly usd: BigNumber;
}

export interface AddressFungibleTokensSummary {
  readonly netWorthUsd: BigNumber;
  readonly tokensUsd: BigNumber;
  readonly tokensNum: number;
  readonly isOverflow: boolean;
  readonly topTokens: Array<TopToken> | undefined;
}

export const getAddressFungibleTokensSummary = (nativeCoin: NativeCoinHolding, tokens: TokenSelectData): AddressFungibleTokensSummary => {
  const fungibleTokens = Object.fromEntries(Object.entries(tokens).filter(([ typeId ]) => FUNGIBLE_TOKEN_TYPES.includes(typeId)));
  const { usd: tokensUsd, num: tokensNum, isOverflow } = getTokensTotalInfo(fungibleTokens);
  const netWorthUsd = nativeCoin.usd.plus(tokensUsd);

  const tokenHoldings = Object.values(fungibleTokens)
    .flatMap(({ items }) => items)
    .filter((item) => !isNativeToken(item))
    .map((item) => ({ symbol: item.token?.symbol ?? 'Unknown', usd: item.usd }));

  const holdings = nativeCoin.balance.gt(0) ?
    [ { symbol: nativeCoin.symbol, usd: nativeCoin.usd }, ...tokenHoldings ] :
    tokenHoldings;

  return { netWorthUsd, tokensUsd, tokensNum, isOverflow, topTokens: getTopTokens(holdings, netWorthUsd) };
};
