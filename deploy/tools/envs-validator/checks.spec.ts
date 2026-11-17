// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import {
  findDeprecationWarnings,
  findEnvsWithoutPlaceholder,
  pickAppEnvs,
  runChecks,
  substituteJsonConfigs,
  validateEnvs,
} from './checks';
import { DEPRECATED_ENVS } from './deprecations';

const MINIMAL_ENVS = {
  NEXT_PUBLIC_APP_HOST: 'localhost',
  NEXT_PUBLIC_API_HOST: 'blockscout.com',
  NEXT_PUBLIC_NETWORK_NAME: 'Testnet',
  NEXT_PUBLIC_NETWORK_ID: '1',
};

const MINIMAL_MULTICHAIN_ENVS = {
  NEXT_PUBLIC_MULTICHAIN_ENABLED: 'true',
  NEXT_PUBLIC_APP_HOST: 'localhost',
  NEXT_PUBLIC_NETWORK_NAME: 'Testnet',
};

const registryOf = (envs: Record<string, string>) => Object.keys(envs);

describe('pickAppEnvs', () => {
  it('keeps only NEXT_PUBLIC_ variables and turns an unset value into an empty string', () => {
    expect(pickAppEnvs({ NEXT_PUBLIC_A: 'a', NEXT_PUBLIC_B: undefined, PATH: '/bin', HOME: undefined })).toEqual({
      NEXT_PUBLIC_A: 'a',
      NEXT_PUBLIC_B: '',
    });
  });
});

describe('findDeprecationWarnings', () => {
  const deprecated = DEPRECATED_ENVS[0];

  it('warns about a deprecated variable that is set, even to an empty string', () => {
    expect(findDeprecationWarnings({ [deprecated.name]: '' })).toEqual([ deprecated.message ]);
  });

  it('returns nothing when no deprecated variable is set', () => {
    expect(findDeprecationWarnings({ NEXT_PUBLIC_APP_HOST: 'localhost' })).toEqual([]);
  });
});

describe('findEnvsWithoutPlaceholder', () => {
  it('lists the variables that are neither in the registry nor build-time', () => {
    const envs = { NEXT_PUBLIC_A: '1', NEXT_PUBLIC_B: '2', NEXT_PUBLIC_C: '3', NEXT_PUBLIC_D: '4' };
    expect(findEnvsWithoutPlaceholder(envs, [ 'NEXT_PUBLIC_A' ], [ 'NEXT_PUBLIC_B' ])).toEqual([ 'NEXT_PUBLIC_C', 'NEXT_PUBLIC_D' ]);
  });

  it('returns nothing when every variable has a placeholder', () => {
    expect(findEnvsWithoutPlaceholder({ NEXT_PUBLIC_A: '1' }, [ 'NEXT_PUBLIC_A' ], [])).toEqual([]);
  });
});

describe('substituteJsonConfigs', () => {
  it('replaces the URL of a set JSON-config variable with the file content', () => {
    const envs = { NEXT_PUBLIC_FOOTER_LINKS: 'https://example.com/links.json', NEXT_PUBLIC_APP_HOST: 'localhost' };
    expect(substituteJsonConfigs(envs, { NEXT_PUBLIC_FOOTER_LINKS: '[{"title":"Foo","links":[]}]' })).toEqual({
      NEXT_PUBLIC_FOOTER_LINKS: '[{"title":"Foo","links":[]}]',
      NEXT_PUBLIC_APP_HOST: 'localhost',
    });
  });

  it('falls back to an empty array when the file content is missing or empty', () => {
    const envs = { NEXT_PUBLIC_FOOTER_LINKS: 'https://example.com/links.json' };
    expect(substituteJsonConfigs(envs, {})).toEqual({ NEXT_PUBLIC_FOOTER_LINKS: '[]' });
    expect(substituteJsonConfigs(envs, { NEXT_PUBLIC_FOOTER_LINKS: '' })).toEqual({ NEXT_PUBLIC_FOOTER_LINKS: '[]' });
  });

  it('leaves an unset JSON-config variable alone', () => {
    expect(substituteJsonConfigs({ NEXT_PUBLIC_APP_HOST: 'localhost' }, { NEXT_PUBLIC_FOOTER_LINKS: '[]' })).toEqual({
      NEXT_PUBLIC_APP_HOST: 'localhost',
    });
  });
});

describe('validateEnvs', () => {
  it('accepts a minimal single-chain configuration', () => {
    expect(validateEnvs(MINIMAL_ENVS, {})).toEqual([]);
  });

  it('collects every error instead of stopping at the first one', () => {
    const errors = validateEnvs({ ...MINIMAL_ENVS, NEXT_PUBLIC_APP_PORT: 'abc', NEXT_PUBLIC_NETWORK_ID: 'xyz' }, {});
    expect(errors.toSorted()).toEqual([
      'NEXT_PUBLIC_APP_PORT: Expected a decimal number but received "abc"',
      'NEXT_PUBLIC_NETWORK_ID: Expected a decimal number but received "xyz"',
    ]);
  });

  it('validates against the multichain schema when NEXT_PUBLIC_MULTICHAIN_ENABLED is true', () => {
    expect(validateEnvs(MINIMAL_MULTICHAIN_ENVS, {})).toEqual([]);
    expect(validateEnvs({ ...MINIMAL_MULTICHAIN_ENVS, NEXT_PUBLIC_GAS_TRACKER_ENABLED: 'true' }, {})).toEqual([
      'NEXT_PUBLIC_GAS_TRACKER_ENABLED: Invalid type: Expected false but received true',
    ]);
  });

  it('validates the JSON-config file content in place of the URL', () => {
    const envs = { ...MINIMAL_ENVS, NEXT_PUBLIC_FOOTER_LINKS: 'https://example.com/links.json' };
    expect(validateEnvs(envs, { NEXT_PUBLIC_FOOTER_LINKS: '[{"title":"Foo","links":[]}]' })).toEqual([]);
    expect(validateEnvs(envs, { NEXT_PUBLIC_FOOTER_LINKS: '[{"links":[]}]' })).toEqual([
      'NEXT_PUBLIC_FOOTER_LINKS.0.title: Invalid key: Expected "title" but received undefined',
    ]);
  });
});

describe('runChecks', () => {
  it('passes a valid configuration with placeholders for every variable', () => {
    expect(runChecks({ envs: MINIMAL_ENVS, registryNames: registryOf(MINIMAL_ENVS), buildTimeNames: [], jsonConfigs: {} })).toEqual({
      ok: true,
      deprecationWarnings: [],
      placeholderErrors: [],
      validationErrors: [],
    });
  });

  it('stops before validation when a variable has no placeholder', () => {
    const envs = { ...MINIMAL_ENVS, NEXT_PUBLIC_UNKNOWN: 'x', NEXT_PUBLIC_APP_PORT: 'abc' };
    expect(runChecks({ envs, registryNames: registryOf(MINIMAL_ENVS), buildTimeNames: [], jsonConfigs: {} })).toEqual({
      ok: false,
      deprecationWarnings: [],
      placeholderErrors: [ 'NEXT_PUBLIC_UNKNOWN', 'NEXT_PUBLIC_APP_PORT' ],
      validationErrors: [],
    });
  });

  it('does not require a placeholder for a build-time variable', () => {
    const envs = { ...MINIMAL_ENVS, NEXT_PUBLIC_GIT_TAG: 'v1.0.0' };
    const report = runChecks({ envs, registryNames: registryOf(MINIMAL_ENVS), buildTimeNames: [ 'NEXT_PUBLIC_GIT_TAG' ], jsonConfigs: {} });
    expect(report.ok).toBe(true);
  });

  it('fails on validation errors and reports them', () => {
    const envs = { ...MINIMAL_ENVS, NEXT_PUBLIC_APP_PROTOCOL: 'ftp' };
    expect(runChecks({ envs, registryNames: registryOf(envs), buildTimeNames: [], jsonConfigs: {} })).toEqual({
      ok: false,
      deprecationWarnings: [],
      placeholderErrors: [],
      validationErrors: [ 'NEXT_PUBLIC_APP_PROTOCOL: Invalid type: Expected ("http" | "https") but received "ftp"' ],
    });
  });

  it('reports a deprecation warning without failing', () => {
    const deprecated = DEPRECATED_ENVS[0];
    const envs = { ...MINIMAL_ENVS, [deprecated.name]: 'hello' };
    expect(runChecks({ envs, registryNames: registryOf(envs), buildTimeNames: [], jsonConfigs: {} })).toEqual({
      ok: true,
      deprecationWarnings: [ deprecated.message ],
      placeholderErrors: [],
      validationErrors: [],
    });
  });
});
