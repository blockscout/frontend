// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { toEnvValue } from '../test-utils';
import { getValidationErrors } from '../utils';
import chainSchema from './chain';

const REQUIRED = { NEXT_PUBLIC_NETWORK_ID: '1', NEXT_PUBLIC_NETWORK_NAME: 'Testnet' };

describe('chainSchema', () => {
  it('accepts the full network configuration', () => {
    expect(getValidationErrors(chainSchema, {
      ...REQUIRED,
      NEXT_PUBLIC_NETWORK_SHORT_NAME: 'Test',
      NEXT_PUBLIC_NETWORK_RPC_URL: 'https://example.com',
      NEXT_PUBLIC_NETWORK_CURRENCY_NAME: 'Ether',
      NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME: 'wei',
      NEXT_PUBLIC_NETWORK_CURRENCY_GWEI_NAME: 'gwei',
      NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL: 'ETH',
      NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS: '18',
      NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL: 'GNO',
      NEXT_PUBLIC_NETWORK_MULTIPLE_GAS_CURRENCIES: 'true',
      NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE: 'validation',
      NEXT_PUBLIC_NETWORK_TOKEN_STANDARD_NAME: 'ERC',
      NEXT_PUBLIC_NETWORK_ADDITIONAL_TOKEN_TYPES: toEnvValue([ { id: 'ERC-404', name: 'ERC-404' } ]),
      NEXT_PUBLIC_IS_TESTNET: 'true',
    })).toEqual([]);
  });

  it('requires the network id and name', () => {
    expect(getValidationErrors(chainSchema, {})).toEqual([
      'NEXT_PUBLIC_NETWORK_NAME: Invalid key: Expected "NEXT_PUBLIC_NETWORK_NAME" but received undefined',
      'NEXT_PUBLIC_NETWORK_ID: Invalid key: Expected "NEXT_PUBLIC_NETWORK_ID" but received undefined',
    ]);
  });

  it('rejects a network id that is not a positive integer', () => {
    expect(getValidationErrors(chainSchema, { ...REQUIRED, NEXT_PUBLIC_NETWORK_ID: '-1' })).toEqual([
      'NEXT_PUBLIC_NETWORK_ID: Invalid value: Expected >=1 but received -1',
    ]);
    expect(getValidationErrors(chainSchema, { ...REQUIRED, NEXT_PUBLIC_NETWORK_ID: '1.5' })).toEqual([
      'NEXT_PUBLIC_NETWORK_ID: Invalid integer: Received 1.5',
    ]);
    expect(getValidationErrors(chainSchema, { ...REQUIRED, NEXT_PUBLIC_NETWORK_ID: 'one' })).toEqual([
      'NEXT_PUBLIC_NETWORK_ID: Expected a decimal number but received "one"',
    ]);
  });

  it('rejects currency decimals that are not a positive integer', () => {
    expect(getValidationErrors(chainSchema, { ...REQUIRED, NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS: '0' })).toEqual([
      'NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS: Invalid value: Expected >=1 but received 0',
    ]);
  });

  it.each([
    'NEXT_PUBLIC_NETWORK_MULTIPLE_GAS_CURRENCIES',
    'NEXT_PUBLIC_IS_TESTNET',
  ])('rejects a non-boolean %s', (name) => {
    expect(getValidationErrors(chainSchema, { ...REQUIRED, [name]: 'yes' })).toEqual([
      `${ name }: Expected "true" or "false" but received "yes"`,
    ]);
  });

  describe('RPC URL', () => {
    it('accepts a single URL', () => {
      expect(getValidationErrors(chainSchema, { ...REQUIRED, NEXT_PUBLIC_NETWORK_RPC_URL: 'https://example.com' })).toEqual([]);
    });

    it('accepts an array of URLs', () => {
      expect(getValidationErrors(chainSchema, {
        ...REQUIRED,
        NEXT_PUBLIC_NETWORK_RPC_URL: toEnvValue([ 'https://example.com', 'https://example2.com' ]),
      })).toEqual([]);
    });

    it('rejects an array containing a malformed URL', () => {
      expect(getValidationErrors(chainSchema, {
        ...REQUIRED,
        NEXT_PUBLIC_NETWORK_RPC_URL: toEnvValue([ 'https://example.com', 'not a url' ]),
      })).toEqual([
        'NEXT_PUBLIC_NETWORK_RPC_URL: Invalid type: Expected string but received "[\'https://example.com\',\'not a url\']"',
      ]);
    });
  });

  describe('verification type', () => {
    it('rejects an unknown value', () => {
      expect(getValidationErrors(chainSchema, { ...REQUIRED, NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE: 'staking' })).toEqual([
        'NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE: Invalid type: Expected ("validation" | "mining" | "fee reception") but received "staking"',
      ]);
    });

    it('rejects the value for Arbitrum rollups', () => {
      expect(getValidationErrors(chainSchema, {
        ...REQUIRED,
        NEXT_PUBLIC_ROLLUP_TYPE: 'arbitrum',
        NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE: 'validation',
      })).toEqual([ 'NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE can not be set for Arbitrum rollups' ]);
    });
  });

  describe('additional token types', () => {
    it('rejects an entry without a name', () => {
      expect(getValidationErrors(chainSchema, {
        ...REQUIRED,
        NEXT_PUBLIC_NETWORK_ADDITIONAL_TOKEN_TYPES: toEnvValue([ { id: 'ERC-404' } ]),
      })).toEqual([ 'NEXT_PUBLIC_NETWORK_ADDITIONAL_TOKEN_TYPES.0.name: Invalid key: Expected "name" but received undefined' ]);
    });

    it('rejects an entry with an unknown property', () => {
      expect(getValidationErrors(chainSchema, {
        ...REQUIRED,
        NEXT_PUBLIC_NETWORK_ADDITIONAL_TOKEN_TYPES: toEnvValue([ { id: 'ERC-404', name: 'ERC-404', symbol: 'X' } ]),
      })).toEqual([ 'NEXT_PUBLIC_NETWORK_ADDITIONAL_TOKEN_TYPES.0.symbol: Invalid key: Expected never but received "symbol"' ]);
    });
  });
});
