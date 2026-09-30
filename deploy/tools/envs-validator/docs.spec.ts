// SPDX-License-Identifier: LicenseRef-Blockscout

import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { DEPRECATED_ENVS } from './deprecations';
import { extractDocumentedEnvNames, extractEnvNames } from './registry';
import schema from './schema';
import schemaMultichain from './schema_multichain';

const readDoc = (name: string): string => readFileSync(new URL(`../../../docs/${ name }`, import.meta.url), 'utf8');

const mentionedNames = new Set([
  ...extractEnvNames(readDoc('ENVS.md')),
  ...extractEnvNames(readDoc('BUILD-TIME_ENVS.md')),
]);
const documentedRunTimeNames = extractDocumentedEnvNames(readDoc('ENVS.md'));
const deprecatedNames = new Set(extractDocumentedEnvNames(readDoc('DEPRECATED_ENVS.md')));
const schemaNames = new Set([ ...Object.keys(schema.fields), ...Object.keys(schemaMultichain.fields) ]);

describe('docs/ENVS.md', () => {
  it('mentions every variable the schemas accept', () => {
    const undocumented = Array.from(schemaNames).filter((name) => !mentionedNames.has(name));
    expect(undocumented).toEqual([]);
  });

  it('has no row for a variable the schemas do not accept', () => {
    const unknown = documentedRunTimeNames.filter((name) => !schemaNames.has(name));
    expect(unknown).toEqual([]);
  });
});

describe('docs/DEPRECATED_ENVS.md', () => {
  it('lists every variable the validator warns about, unless the variable is still documented as active', () => {
    const missing = DEPRECATED_ENVS
      .map(({ name }) => name)
      .filter((name) => !deprecatedNames.has(name) && !mentionedNames.has(name));
    expect(missing).toEqual([]);
  });
});
