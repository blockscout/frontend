// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { toEnvValue } from '../../test-utils';
import { getValidationErrors } from '../../utils';
import { crossChainTxsSchema } from './crossChainTxs';

const ENABLED = { NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED: 'true' };
const BRIDGE_IDS = { NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS: toEnvValue([ 1, 2 ]) };

describe('crossChainTxsSchema', () => {
  it('accepts the full feature config', () => {
    expect(getValidationErrors(crossChainTxsSchema, {
      ...ENABLED,
      ...BRIDGE_IDS,
      NEXT_PUBLIC_CROSS_CHAIN_TXS_INCLUDE_UNINDEXED_CHAINS: 'true',
      NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST: 'https://api.example.com',
    })).toEqual([]);
  });

  it('rejects a malformed enabled flag', () => {
    expect(getValidationErrors(crossChainTxsSchema, { NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED: 'yes', ...BRIDGE_IDS })).toEqual([
      'NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED must be a `boolean` type, but the final value was: `"yes"`.',
    ]);
  });

  it('rejects the enabled flag without bridge ids', () => {
    expect(getValidationErrors(crossChainTxsSchema, ENABLED)).toEqual([ 'NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS is a required field' ]);
  });

  it('rejects a bridge id that is not a number', () => {
    expect(getValidationErrors(crossChainTxsSchema, {
      ...ENABLED,
      NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS: toEnvValue([ 'omni' ]),
    })).toEqual([ 'NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS[0] must be a `number` type, but the final value was: `NaN` (cast from the value `"["`).' ]);
  });

  it('rejects a malformed indexer API host', () => {
    expect(getValidationErrors(crossChainTxsSchema, {
      ...ENABLED,
      ...BRIDGE_IDS,
      NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST: 'not a url',
    })).toEqual([ 'NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST is not a valid URL' ]);
  });

  it.each([
    [ 'NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS', BRIDGE_IDS.NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS ],
    [ 'NEXT_PUBLIC_CROSS_CHAIN_TXS_INCLUDE_UNINDEXED_CHAINS', 'true' ],
    [ 'NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST', 'https://api.example.com' ],
  ])('rejects %s without the enabled flag', (name, value) => {
    expect(getValidationErrors(crossChainTxsSchema, { [name]: value })).toEqual([
      `${ name } can only be used with NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED`,
    ]);
  });
});
