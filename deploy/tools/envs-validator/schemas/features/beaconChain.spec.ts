// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getValidationErrors } from '../../utils';
import { beaconChainSchema } from './beaconChain';

const ENABLED = { NEXT_PUBLIC_HAS_BEACON_CHAIN: 'true' };

describe('beaconChainSchema', () => {
  it('accepts the beacon chain settings together with the flag', () => {
    expect(getValidationErrors(beaconChainSchema, {
      ...ENABLED,
      NEXT_PUBLIC_BEACON_CHAIN_WITHDRAWALS_ONLY: 'false',
      NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL: 'aETH',
      NEXT_PUBLIC_BEACON_CHAIN_VALIDATOR_URL_TEMPLATE: 'https://beacon.example.com/validator/{pk}',
    })).toEqual([]);
  });

  it('rejects a malformed flag', () => {
    expect(getValidationErrors(beaconChainSchema, { NEXT_PUBLIC_HAS_BEACON_CHAIN: 'yes' })).toEqual([
      'NEXT_PUBLIC_HAS_BEACON_CHAIN: Expected "true" or "false" but received "yes"',
    ]);
  });

  it('rejects an empty currency symbol', () => {
    expect(getValidationErrors(beaconChainSchema, { ...ENABLED, NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL: '' })).toEqual([
      'NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL: Invalid length: Expected !0 but received 0',
    ]);
  });

  it.each([
    [ 'NEXT_PUBLIC_BEACON_CHAIN_WITHDRAWALS_ONLY', 'true', 'can only be used if NEXT_PUBLIC_HAS_BEACON_CHAIN is set to "true"' ],
    [ 'NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL', 'aETH', 'cannot not be used if NEXT_PUBLIC_HAS_BEACON_CHAIN is not set to "true"' ],
    [
      'NEXT_PUBLIC_BEACON_CHAIN_VALIDATOR_URL_TEMPLATE',
      'https://beacon.example.com/{pk}',
      'cannot not be used if NEXT_PUBLIC_HAS_BEACON_CHAIN is not set to "true"',
    ],
  ])('rejects %s without the flag', (name, value, message) => {
    expect(getValidationErrors(beaconChainSchema, { [name]: value })).toEqual([ `${ name } ${ message }` ]);
  });
});
