// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { multichainConfig } from './mocks/instance';
import schema from './schema_multichain';
import { toEnvValue } from './test-utils';
import { getValidationErrors } from './utils';

const REQUIRED = {
  NEXT_PUBLIC_APP_HOST: 'localhost',
  NEXT_PUBLIC_NETWORK_NAME: 'Multichain',
};

describe('multichain schema', () => {
  it('accepts a full known-good configuration', () => {
    expect(getValidationErrors(schema, multichainConfig)).toEqual([]);
  });

  it('requires the app host and network name only', () => {
    expect(getValidationErrors(schema, {}).sort()).toEqual([
      'NEXT_PUBLIC_APP_HOST: Invalid key: Expected "NEXT_PUBLIC_APP_HOST" but received undefined',
      'NEXT_PUBLIC_NETWORK_NAME: Invalid key: Expected "NEXT_PUBLIC_NETWORK_NAME" but received undefined',
    ]);
  });

  it('rejects an unknown variable', () => {
    expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_DUCK: 'quack' })).toEqual([
      'Unknown ENV variables were provided: NEXT_PUBLIC_DUCK',
    ]);
  });

  it.each([
    [ 'NEXT_PUBLIC_NETWORK_ID', '1' ],
    [ 'NEXT_PUBLIC_ROLLUP_TYPE', 'optimistic' ],
  ])('treats the single-chain-only %s as unknown', (name, value) => {
    expect(getValidationErrors(schema, { ...REQUIRED, [name]: value })).toEqual([ `Unknown ENV variables were provided: ${ name }` ]);
  });

  describe('features disabled in multichain mode', () => {
    it.each([
      'NEXT_PUBLIC_GAS_TRACKER_ENABLED',
      'NEXT_PUBLIC_ADVANCED_FILTER_ENABLED',
      'NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED',
    ])('accepts %s set to false and rejects it set to true', (name) => {
      expect(getValidationErrors(schema, { ...REQUIRED, [name]: 'false' })).toEqual([]);
      expect(getValidationErrors(schema, { ...REQUIRED, [name]: 'true' })).toEqual([ `${ name }: Invalid type: Expected false but received true` ]);
    });

    it('accepts an empty API docs tabs list and rejects a non-empty one', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_API_DOCS_TABS: '[]' })).toEqual([]);
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_API_DOCS_TABS: toEnvValue([ 'rest_api' ]) })).toEqual([
        'NEXT_PUBLIC_API_DOCS_TABS: Invalid length: Expected <=0 but received 1',
      ]);
    });
  });

  describe('multichain services', () => {
    it('accepts valid aggregator and stats hosts', () => {
      expect(getValidationErrors(schema, {
        ...REQUIRED,
        NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST: 'https://example.com',
        NEXT_PUBLIC_MULTICHAIN_STATS_API_HOST: 'https://example.com',
      })).toEqual([]);
    });

    it.each([
      'NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST',
      'NEXT_PUBLIC_MULTICHAIN_STATS_API_HOST',
    ])('rejects a malformed %s', (name) => {
      expect(getValidationErrors(schema, { ...REQUIRED, [name]: 'not a url' })).toEqual([ `${ name }: Invalid URL: Received "not a url"` ]);
    });
  });
});
