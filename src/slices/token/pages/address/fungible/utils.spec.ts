import BigNumber from 'bignumber.js';

import type { schemas } from '@blockscout/api-types';

import * as tokensMock from 'src/slices/token/mocks/address-tokens';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type { TokenEnhancedData, TokenSelectData } from '../utils';
import { getAddressFungibleTokensSummary } from './utils';

const NATIVE_SYMBOL = 'ETH';
const NO_NATIVE_COIN = { symbol: NATIVE_SYMBOL, balance: BigNumber(0), usd: BigNumber(0) };
const NATIVE_TOKEN_ADDRESS = '0x00000000000000000000000000000000000000Aa';

const holding = (symbol: string, usd: number | undefined, addressHash = `0x${ symbol }`): TokenEnhancedData => ({
  ...tokensMock.erc20a,
  token: { ...tokensMock.erc20a.token, symbol, address_hash: addressHash } as schemas['Token'],
  usd: usd === undefined ? undefined : BigNumber(usd),
});

const nativeCoin = (usd: number) => ({ symbol: NATIVE_SYMBOL, balance: BigNumber(1), usd: BigNumber(usd) });

const tokens = (erc20: Array<TokenEnhancedData>, rest: TokenSelectData = {}): TokenSelectData => ({
  'ERC-20': { items: erc20, isOverflow: false },
  ...rest,
});

describe('getAddressFungibleTokensSummary', () => {
  it('ranks the native coin among the top holdings', () => {
    const result = getAddressFungibleTokensSummary(nativeCoin(60), tokens([ holding('USDC', 30), holding('USDT', 10) ]));

    expect(result.netWorthUsd.toFixed()).toBe('100');
    expect(result.tokensUsd.toFixed()).toBe('40');
    expect(result.tokensNum).toBe(2);
    expect(result.topTokens).toEqual([
      { symbol: NATIVE_SYMBOL, share: 0.6 },
      { symbol: 'USDC', share: 0.3 },
      { symbol: 'Others', share: 0.1 },
    ]);
  });

  it('keeps the two largest holdings and folds the rest into Others', () => {
    const result = getAddressFungibleTokensSummary(
      nativeCoin(5),
      tokens([ holding('AAA', 15), holding('BBB', 50), holding('CCC', 30), holding('DDD', undefined) ]),
    );

    expect(result.topTokens).toEqual([
      { symbol: 'BBB', share: 0.5 },
      { symbol: 'CCC', share: 0.3 },
      { symbol: 'Others', share: 0.2 },
    ]);
  });

  it('adds no Others entry when two holdings make the whole value', () => {
    const result = getAddressFungibleTokensSummary(nativeCoin(0.7), tokens([ holding('USDC', 0.3) ]));

    expect(result.topTokens).toEqual([
      { symbol: NATIVE_SYMBOL, share: 0.7 },
      { symbol: 'USDC', share: 0.3 },
    ]);
  });

  it('gives a single holding the whole bar', () => {
    expect(getAddressFungibleTokensSummary(nativeCoin(42), tokens([])).topTokens).toEqual([ { symbol: NATIVE_SYMBOL, share: 1 } ]);
    expect(getAddressFungibleTokensSummary(NO_NATIVE_COIN, tokens([ holding('USDC', 42) ])).topTokens).toEqual([ { symbol: 'USDC', share: 1 } ]);
  });

  it('names the only holding when nothing has a USD value', () => {
    const result = getAddressFungibleTokensSummary(NO_NATIVE_COIN, tokens([ holding('HyFi', undefined) ]));

    expect(result.netWorthUsd.toFixed()).toBe('0');
    expect(result.topTokens).toEqual([ { symbol: 'HyFi', share: 1 } ]);
  });

  it('shows Others alone when several holdings have no USD value', () => {
    const result = getAddressFungibleTokensSummary(nativeCoin(0), tokens([ holding('HyFi', undefined), holding('ZETA', undefined) ]));

    expect(result.tokensNum).toBe(2);
    expect(result.topTokens).toEqual([ { symbol: 'Others', share: 1 } ]);
  });

  it('has no breakdown when the address holds neither tokens nor the native coin', () => {
    const result = getAddressFungibleTokensSummary(NO_NATIVE_COIN, tokens([]));

    expect(result.tokensNum).toBe(0);
    expect(result.tokensUsd.toFixed()).toBe('0');
    expect(result.topTokens).toBeUndefined();
  });

  it('leaves NFTs out of the count, the value and the breakdown', () => {
    const result = getAddressFungibleTokensSummary(NO_NATIVE_COIN, tokens([ holding('USDC', 10) ], {
      'ERC-721': { items: [ { ...tokensMock.erc721a, usd: BigNumber(90) } ], isOverflow: true },
      'ERC-1155': { items: [ tokensMock.erc1155a ], isOverflow: false },
    }));

    expect(result.tokensNum).toBe(1);
    expect(result.tokensUsd.toFixed()).toBe('10');
    expect(result.isOverflow).toBe(false);
    expect(result.topTokens).toEqual([ { symbol: 'USDC', share: 1 } ]);
  });

  it('reports an overflow when a fungible list has more pages', () => {
    const result = getAddressFungibleTokensSummary(NO_NATIVE_COIN, { 'ERC-20': { items: [ holding('USDC', 10) ], isOverflow: true } });

    expect(result.isOverflow).toBe(true);
  });

  it('merges holdings that share a symbol', () => {
    const result = getAddressFungibleTokensSummary(
      NO_NATIVE_COIN,
      tokens([ holding('USDC', 20, '0x01'), holding('DAI', 30), holding('USDC', 50, '0x02') ]),
    );

    expect(result.topTokens).toEqual([
      { symbol: 'USDC', share: 0.7 },
      { symbol: 'DAI', share: 0.3 },
    ]);
  });

  it('counts the token that mirrors the native coin but keeps its value out of the totals', async() => {
    const result = await withEnvs([ [ 'NEXT_PUBLIC_VIEWS_ADDRESS_NATIVE_TOKEN_ADDRESS', NATIVE_TOKEN_ADDRESS ] ], async() => {
      const { getAddressFungibleTokensSummary } = await import('./utils');
      return getAddressFungibleTokensSummary(
        nativeCoin(60),
        tokens([ holding('WETH', 60, NATIVE_TOKEN_ADDRESS.toLowerCase()), holding('USDC', 40) ]),
      );
    });

    expect(result.tokensNum).toBe(2);
    expect(result.tokensUsd.toFixed()).toBe('40');
    expect(result.netWorthUsd.toFixed()).toBe('100');
    expect(result.topTokens).toEqual([
      { symbol: NATIVE_SYMBOL, share: 0.6 },
      { symbol: 'USDC', share: 0.4 },
    ]);
  });
});
