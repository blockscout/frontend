// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import { erc20, erc721, erc8056 } from '../mocks';

const CURRENT_TOKEN_FACTOR = '2000000000000000000';

const erc8056WithChangedTokenFactor: schemas['TokenTransfer'] = {
  ...erc8056,
  token: { ...erc8056.token!, ui_multiplier: CURRENT_TOKEN_FACTOR },
};

function resolveWithTypeEnabled(data: schemas['TokenTransfer']) {
  return withEnvs(ENVS_MAP.additionalTokenTypes, async() => {
    const { getTokenTransferUiMultiplier } = await import('./get-token-transfer-ui-multiplier');
    return getTokenTransferUiMultiplier(data);
  });
}

describe('getTokenTransferUiMultiplier', () => {
  it('resolves the factor that applied to the transfer', async() => {
    const result = await resolveWithTypeEnabled(erc8056);
    expect(result?.toFixed()).toBe('1.69');
  });

  it('ignores the token current factor', async() => {
    const result = await resolveWithTypeEnabled(erc8056WithChangedTokenFactor);
    expect(result?.toFixed()).toBe('1.69');
  });

  it('resolves to nothing when the transfer factor is null, with no fallback to the token', async() => {
    const result = await resolveWithTypeEnabled({
      ...erc8056WithChangedTokenFactor,
      total: { ...erc8056.total as schemas['TokenTransferTotalFungible'], ui_multiplier: null },
    });
    expect(result).toBeUndefined();
  });

  it('resolves to nothing for a transfer of another fungible type', async() => {
    expect(await resolveWithTypeEnabled(erc20)).toBeUndefined();
  });

  it('resolves to nothing for an NFT transfer', async() => {
    expect(await resolveWithTypeEnabled(erc721)).toBeUndefined();
  });

  it('resolves to nothing when the transfer has no total', async() => {
    expect(await resolveWithTypeEnabled({ ...erc8056, total: null })).toBeUndefined();
  });

  it('resolves to nothing when ERC-8056 is not among the instance additional token types', async() => {
    const { getTokenTransferUiMultiplier } = await import('./get-token-transfer-ui-multiplier');
    expect(getTokenTransferUiMultiplier(erc8056)).toBeUndefined();
  });
});
