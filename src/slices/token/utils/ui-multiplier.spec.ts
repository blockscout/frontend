import BigNumber from 'bignumber.js';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { thinsp } from 'src/toolkit/utils/htmlEntities';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type { UiMultiplierSource } from './ui-multiplier';

const ONE = '1000000000000000000';
const ONE_POINT_SIX_NINE = '1690000000000000000';
const ONE_POINT_ZERO_ZERO_TWO_FIVE = '1002500000000000000';
const BELOW_SMALLEST_REPRESENTABLE = '100000000000';

const erc8056Token: UiMultiplierSource = { type: 'ERC-8056', ui_multiplier: ONE_POINT_SIX_NINE };

function getUiMultiplierWithTypeEnabled(token: UiMultiplierSource | null | undefined) {
  return withEnvs(ENVS_MAP.additionalTokenTypes, async() => {
    const { getUiMultiplier } = await import('./ui-multiplier');
    return getUiMultiplier(token);
  });
}

describe('getUiMultiplier', () => {
  it('resolves the factor divided by 10^18 when the type is enabled and the field is set', async() => {
    const result = await getUiMultiplierWithTypeEnabled(erc8056Token);
    expect(result?.toFixed()).toBe('1.69');
  });

  it('resolves exactly 1', async() => {
    const result = await getUiMultiplierWithTypeEnabled({ ...erc8056Token, ui_multiplier: ONE });
    expect(result?.isEqualTo(1)).toBe(true);
  });

  it('resolves to nothing when ERC-8056 is not among the instance additional token types', async() => {
    const { getUiMultiplier } = await import('./ui-multiplier');
    expect(getUiMultiplier(erc8056Token)).toBeUndefined();
  });

  it('resolves to nothing for a token of another type', async() => {
    expect(await getUiMultiplierWithTypeEnabled({ ...erc8056Token, type: 'ERC-20' })).toBeUndefined();
  });

  it('resolves to nothing when the field is null', async() => {
    expect(await getUiMultiplierWithTypeEnabled({ ...erc8056Token, ui_multiplier: null })).toBeUndefined();
  });

  it('resolves to nothing when there is no token', async() => {
    expect(await getUiMultiplierWithTypeEnabled(null)).toBeUndefined();
  });
});

describe('formatUiMultiplier', () => {
  it.each([
    [ ONE, '1x' ],
    [ ONE_POINT_SIX_NINE, '1.69x' ],
    [ ONE_POINT_ZERO_ZERO_TWO_FIVE, '1.0025x' ],
    [ BELOW_SMALLEST_REPRESENTABLE, `<${ thinsp }0.000001x` ],
  ])('%s → %s', async(rawValue, expected) => {
    const { formatUiMultiplier } = await import('./ui-multiplier');
    expect(formatUiMultiplier(new BigNumber(rawValue).shiftedBy(-18))).toBe(expected);
  });
});
