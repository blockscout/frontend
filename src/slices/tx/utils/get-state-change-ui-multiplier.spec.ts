// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import { receiveCoin, receiveMintedToken, sendERC20Token, sendERC8056Token } from '../mocks/state-changes';

const CURRENT_TOKEN_FACTOR = '2000000000000000000';

function resolveWithTypeEnabled(data: schemas['StateChange']) {
  return withEnvs(ENVS_MAP.additionalTokenTypes, async() => {
    const { getStateChangeUiMultiplier } = await import('./get-state-change-ui-multiplier');
    return getStateChangeUiMultiplier(data);
  });
}

describe('getStateChangeUiMultiplier', () => {
  it('resolves the factor that applied to the state change', async() => {
    const result = await resolveWithTypeEnabled(sendERC8056Token);
    expect(result?.toFixed()).toBe('1.69');
  });

  it('ignores the token current factor', async() => {
    const result = await resolveWithTypeEnabled({
      ...sendERC8056Token,
      token: { ...sendERC8056Token.token!, ui_multiplier: CURRENT_TOKEN_FACTOR },
    });
    expect(result?.toFixed()).toBe('1.69');
  });

  it('resolves to nothing when the state change factor is null, with no fallback to the token', async() => {
    const result = await resolveWithTypeEnabled({
      ...sendERC8056Token,
      token: { ...sendERC8056Token.token!, ui_multiplier: CURRENT_TOKEN_FACTOR },
      ui_multiplier: null,
    });
    expect(result).toBeUndefined();
  });

  it('resolves to nothing for a state change of another fungible type', async() => {
    expect(await resolveWithTypeEnabled({ ...sendERC20Token, ui_multiplier: sendERC8056Token.ui_multiplier })).toBeUndefined();
  });

  it('resolves to nothing for an NFT state change', async() => {
    expect(await resolveWithTypeEnabled(receiveMintedToken)).toBeUndefined();
  });

  it('resolves to nothing for a coin state change', async() => {
    expect(await resolveWithTypeEnabled({ ...receiveCoin, ui_multiplier: sendERC8056Token.ui_multiplier })).toBeUndefined();
  });

  it('resolves to nothing when ERC-8056 is not among the instance additional token types', async() => {
    const { getStateChangeUiMultiplier } = await import('./get-state-change-ui-multiplier');
    expect(getStateChangeUiMultiplier(sendERC8056Token)).toBeUndefined();
  });
});
