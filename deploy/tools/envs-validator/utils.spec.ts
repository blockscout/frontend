// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { describe, expect, it } from 'vitest';

import {
  composeSchemas,
  envBoolean,
  envJson,
  envNumber,
  envPositiveInteger,
  envUrl,
  getValidationErrors,
  requiredIf,
  requires,
} from './utils';

const withEntry = (schema: v.GenericSchema) => v.object({ NEXT_PUBLIC_X: v.optional(schema) });

describe('envBoolean', () => {
  it('parses only the literal strings true and false', () => {
    expect(v.parse(envBoolean(), 'true')).toBe(true);
    expect(v.parse(envBoolean(), 'false')).toBe(false);
  });

  it.each([ 'TRUE', '1', '0', 'yes', '', ' true ' ])('rejects %j', (value) => {
    expect(getValidationErrors(withEntry(envBoolean()), { NEXT_PUBLIC_X: value })).toEqual([
      `NEXT_PUBLIC_X: Expected "true" or "false" but received ${ JSON.stringify(value) }`,
    ]);
  });
});

describe('envNumber', () => {
  it.each([
    [ '3000', 3000 ],
    [ '-1.5', -1.5 ],
    [ '0', 0 ],
  ])('parses the plain decimal %j', (value, expected) => {
    expect(v.parse(envNumber(), value)).toBe(expected);
  });

  it.each([ '0x10', '1e3', ' 3000 ', 'abc', '' ])('rejects %j', (value) => {
    expect(getValidationErrors(withEntry(envNumber()), { NEXT_PUBLIC_X: value })).toEqual([
      `NEXT_PUBLIC_X: Expected a decimal number but received ${ JSON.stringify(value) }`,
    ]);
  });

  it('requires a positive integer where one is expected', () => {
    expect(getValidationErrors(withEntry(envPositiveInteger()), { NEXT_PUBLIC_X: '1.5' })).toEqual([ 'NEXT_PUBLIC_X: Invalid integer: Received 1.5' ]);
    expect(getValidationErrors(withEntry(envPositiveInteger()), { NEXT_PUBLIC_X: '0' })).toEqual([
      'NEXT_PUBLIC_X: Invalid value: Expected >=1 but received 0',
    ]);
  });
});

describe('envUrl', () => {
  it('accepts a URL and the empty string', () => {
    expect(getValidationErrors(withEntry(envUrl()), { NEXT_PUBLIC_X: 'https://example.com/path?q=1' })).toEqual([]);
    expect(getValidationErrors(withEntry(envUrl()), { NEXT_PUBLIC_X: '' })).toEqual([]);
  });

  it('rejects anything new URL() cannot parse', () => {
    expect(getValidationErrors(withEntry(envUrl()), { NEXT_PUBLIC_X: 'example.com' })).toEqual([ 'NEXT_PUBLIC_X: Invalid URL: Received "example.com"' ]);
  });
});

describe('envJson', () => {
  const schema = withEntry(envJson(v.array(v.object({ name: v.string() }))));

  it('accepts the single-quoted form operators use', () => {
    expect(getValidationErrors(schema, { NEXT_PUBLIC_X: '[{\'name\':\'a\'}]' })).toEqual([]);
  });

  it('reports a nested problem with its dot path', () => {
    expect(getValidationErrors(schema, { NEXT_PUBLIC_X: '[{\'title\':\'a\'}]' })).toEqual([
      'NEXT_PUBLIC_X.0.name: Invalid key: Expected "name" but received undefined',
    ]);
  });

  it('rejects a value that is not JSON', () => {
    expect(getValidationErrors(schema, { NEXT_PUBLIC_X: 'nope' })).toEqual([ 'NEXT_PUBLIC_X: Invalid JSON: Received "nope"' ]);
  });
});

describe('companion rules', () => {
  const entries = v.looseObject({
    NEXT_PUBLIC_A: v.optional(envBoolean()),
    NEXT_PUBLIC_B: v.optional(v.string()),
  });

  describe('requires', () => {
    const schema = v.pipe(entries, requires('NEXT_PUBLIC_B', 'NEXT_PUBLIC_A'));

    it('accepts the dependent together with a truthy parsed dependency', () => {
      expect(getValidationErrors(schema, { NEXT_PUBLIC_A: 'true', NEXT_PUBLIC_B: 'x' })).toEqual([]);
      expect(getValidationErrors(schema, {})).toEqual([]);
    });

    it('rejects the dependent when the dependency is unset or parses to false', () => {
      expect(getValidationErrors(schema, { NEXT_PUBLIC_B: 'x' })).toEqual([ 'NEXT_PUBLIC_B can only be used with NEXT_PUBLIC_A' ]);
      expect(getValidationErrors(schema, { NEXT_PUBLIC_A: 'false', NEXT_PUBLIC_B: 'x' })).toEqual([ 'NEXT_PUBLIC_B can only be used with NEXT_PUBLIC_A' ]);
    });

    it('does not fire while the dependency itself is invalid', () => {
      expect(getValidationErrors(schema, { NEXT_PUBLIC_A: 'maybe', NEXT_PUBLIC_B: 'x' })).toEqual([
        'NEXT_PUBLIC_A: Expected "true" or "false" but received "maybe"',
      ]);
    });

    it('takes a custom predicate and message', () => {
      const custom = v.pipe(entries, requires('NEXT_PUBLIC_B', 'NEXT_PUBLIC_C', { when: (value) => value === 'on', message: 'B needs C=on' }));
      expect(getValidationErrors(custom, { NEXT_PUBLIC_C: 'on', NEXT_PUBLIC_B: 'x' })).toEqual([]);
      expect(getValidationErrors(custom, { NEXT_PUBLIC_C: 'off', NEXT_PUBLIC_B: 'x' })).toEqual([ 'B needs C=on' ]);
    });
  });

  describe('requiredIf', () => {
    const schema = v.pipe(entries, requiredIf('NEXT_PUBLIC_B', 'NEXT_PUBLIC_A'));

    it('demands the dependent once the dependency is set', () => {
      expect(getValidationErrors(schema, { NEXT_PUBLIC_A: 'true' })).toEqual([ 'NEXT_PUBLIC_B is required when NEXT_PUBLIC_A is set' ]);
      expect(getValidationErrors(schema, { NEXT_PUBLIC_A: 'true', NEXT_PUBLIC_B: 'x' })).toEqual([]);
      expect(getValidationErrors(schema, { NEXT_PUBLIC_A: 'false' })).toEqual([]);
    });
  });
});

describe('composeSchemas', () => {
  const first = v.pipe(
    v.looseObject({ NEXT_PUBLIC_A: v.optional(envBoolean()) }),
    requires('NEXT_PUBLIC_A', 'NEXT_PUBLIC_B'),
  );
  const second = v.object({ NEXT_PUBLIC_B: v.optional(envUrl()) });
  const schema = composeSchemas([ first, second ]);

  it('lists every variable of every member', () => {
    expect(schema.envNames).toEqual([ 'NEXT_PUBLIC_A', 'NEXT_PUBLIC_B' ]);
  });

  it('resolves a rule that names a variable another member declares', () => {
    expect(getValidationErrors(schema, { NEXT_PUBLIC_A: 'true', NEXT_PUBLIC_B: 'https://example.com' })).toEqual([]);
    expect(getValidationErrors(schema, { NEXT_PUBLIC_A: 'true' })).toEqual([ 'NEXT_PUBLIC_A can only be used with NEXT_PUBLIC_B' ]);
  });

  it('reports unknown variables once, alongside the other errors', () => {
    expect(getValidationErrors(schema, { NEXT_PUBLIC_B: 'nope', NEXT_PUBLIC_C: '1', NEXT_PUBLIC_D: '2' })).toEqual([
      'Unknown ENV variables were provided: NEXT_PUBLIC_C, NEXT_PUBLIC_D',
      'NEXT_PUBLIC_B: Invalid URL: Received "nope"',
    ]);
  });
});
