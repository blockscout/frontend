// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { bridgedTokenChains, tokenBridges } from '../../mocks/bridgedToken';
import { toEnvValue } from '../../test-utils';
import { getValidationErrors } from '../../utils';
import { bridgedTokensSchema } from './bridgedToken';

const CHAINS = { NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS: toEnvValue(bridgedTokenChains) };
const BRIDGES = { NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES: toEnvValue(tokenBridges) };

describe('bridgedTokensSchema', () => {
  it('accepts chains together with bridges', () => {
    expect(getValidationErrors(bridgedTokensSchema, { ...CHAINS, ...BRIDGES })).toEqual([]);
  });

  it('rejects chains without bridges', () => {
    expect(getValidationErrors(bridgedTokensSchema, CHAINS)).toEqual([ 'NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES is a required field' ]);
  });

  it('rejects bridges without chains', () => {
    expect(getValidationErrors(bridgedTokensSchema, BRIDGES)).toEqual([
      'NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES cannot not be used without NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS',
    ]);
  });

  it('rejects a chain with a malformed base URL', () => {
    expect(getValidationErrors(bridgedTokensSchema, {
      ...BRIDGES,
      NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS: toEnvValue([ { ...bridgedTokenChains[0], base_url: 'not a url' } ]),
    })).toEqual([ 'NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS[0].base_url is not a valid URL' ]);
  });

  it('rejects a chain missing a required field', () => {
    const { title, ...chain } = bridgedTokenChains[0];
    expect(getValidationErrors(bridgedTokensSchema, {
      ...BRIDGES,
      NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS: toEnvValue([ chain ]),
    })).toEqual([ 'NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS[0].title is a required field' ]);
  });

  it('rejects a bridge missing a required field', () => {
    const { type, ...bridge } = tokenBridges[0];
    expect(getValidationErrors(bridgedTokensSchema, {
      ...CHAINS,
      NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES: toEnvValue([ bridge ]),
    })).toEqual([ 'NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES[0].type is a required field' ]);
  });
});
