import type { schemas } from '@blockscout/api-types';

import * as tokensMock from 'src/slices/token/mocks/address-tokens';
import { tokenInfoERC20a } from 'src/slices/token/mocks/info';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import { addUsdValue } from './utils';

const ERC20_BALANCE_WITH_RATE: schemas['TokenBalance'] = {
  ...tokensMock.erc20a,
  token: { ...tokenInfoERC20a, exchange_rate: '2' },
  value: '1500000000000000000',
};
const ERC20_USD = '3';

const ERC8056_USD_FROM_SCALED = '845';

describe('addUsdValue', () => {
  it('leaves a non-fungible balance untouched', () => {
    expect(addUsdValue(tokensMock.erc721a)).toBe(tokensMock.erc721a);
  });

  it('leaves a fungible balance without an exchange rate untouched', () => {
    expect(addUsdValue(tokensMock.erc20a)).toBe(tokensMock.erc20a);
  });

  it('computes usd from the balance, decimals and exchange rate', () => {
    const result = addUsdValue(ERC20_BALANCE_WITH_RATE);
    expect(result.usd?.toFixed()).toBe(ERC20_USD);
  });

  it('leaves an ERC-8056 balance untouched when the type is not enabled', () => {
    expect(addUsdValue(tokensMock.erc8056)).toBe(tokensMock.erc8056);
  });

  it('computes usd from the scaled ERC-8056 balance when the type is enabled', async() => {
    const result = await withEnvs(ENVS_MAP.additionalTokenTypes, async() => {
      const { addUsdValue } = await import('./utils');
      return addUsdValue(tokensMock.erc8056);
    });
    expect(result.usd?.toFixed()).toBe(ERC8056_USD_FROM_SCALED);
  });
});
