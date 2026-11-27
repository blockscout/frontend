// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { ENVS_WITH_JSON_CONFIG } from './checks';
import { JSON_CONFIG_FILE_SCHEMAS, validateJsonConfigFile } from './json-configs';
import { marketplaceCategories } from './mocks/marketplace';

const DEPRECATED_CHAIN_VARIANT_ENVS = [ 'NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL' ];

describe('JSON_CONFIG_FILE_SCHEMAS', () => {
  it('has a schema for every variable that links to a JSON config file', () => {
    const missing = ENVS_WITH_JSON_CONFIG
      .filter((name) => !DEPRECATED_CHAIN_VARIANT_ENVS.includes(name))
      .filter((name) => !(name in JSON_CONFIG_FILE_SCHEMAS));
    expect(missing).toEqual([]);
  });
});

describe('validateJsonConfigFile', () => {
  const schema = JSON_CONFIG_FILE_SCHEMAS.NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL;

  it('accepts a file that matches the schema', () => {
    expect(validateJsonConfigFile(schema, JSON.stringify(marketplaceCategories, null, 2))).toEqual([]);
  });

  it('reports where a file does not match the schema', () => {
    expect(validateJsonConfigFile(schema, JSON.stringify([ 'Swaps', 1 ]))).toEqual([
      '1: Invalid type: Expected string but received 1',
    ]);
  });

  it('reports a file that is not JSON', () => {
    expect(validateJsonConfigFile(schema, '[ \'Swaps\' ]')).toEqual([
      expect.stringMatching(/^Invalid JSON: /),
    ]);
  });
});
