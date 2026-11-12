import type { FormFields } from './types';

import { describe, it, expect } from 'vitest';

import type { SmartContractVerificationConfig, SmartContractVerificationMethod } from './utils';
import { DEFAULT_VALUES, getDefaultValues, prepareRequestBody } from './utils';

const HASH = '0x0000000000000000000000000000000000000001';
const LICENSE: FormFields['license_type'] = [ 'mit' ];

const buildConfig = (overrides: Partial<SmartContractVerificationConfig> = {}): SmartContractVerificationConfig => ({
  solidity_compiler_versions: [],
  solidity_evm_versions: [ 'default', 'london' ],
  verification_options: [ 'flattened-code', 'multi-part', 'vyper-multi-part' ],
  vyper_compiler_versions: [],
  vyper_evm_versions: [ 'default', 'paris' ],
  is_rust_verifier_microservice_enabled: false,
  license_types: {} as SmartContractVerificationConfig['license_types'],
  ...overrides,
});

describe('getDefaultValues', () => {
  it('returns only the address if no method is known', () => {
    expect(getDefaultValues(undefined, buildConfig(), HASH, LICENSE)).toEqual({ address: HASH });
  });

  it('returns an empty address if there is neither a method nor a hash', () => {
    expect(getDefaultValues(undefined, buildConfig(), undefined, LICENSE)).toEqual({ address: '' });
  });

  it('fills the method defaults with the address and the license', () => {
    expect(getDefaultValues('sourcify', buildConfig(), HASH, LICENSE)).toEqual({
      address: HASH,
      method: [ 'sourcify' ],
      sources: [],
      license_type: LICENSE,
    });
  });

  it('leaves the address empty if there is no hash', () => {
    expect(getDefaultValues('sourcify', buildConfig(), undefined, LICENSE)).toMatchObject({ address: '' });
  });

  it('does not change the shared defaults', () => {
    getDefaultValues('flattened-code', buildConfig({ is_rust_verifier_microservice_enabled: true }), HASH, LICENSE);

    expect(DEFAULT_VALUES['flattened-code']).toMatchObject({ address: '', name: '', evm_version: [], autodetect_constructor_args: true, license_type: [] });
  });

  describe('evm version', () => {
    it.each<SmartContractVerificationMethod>([ 'flattened-code', 'multi-part' ])('preselects default for %s if solidity supports it', (method) => {
      const config = buildConfig({ vyper_evm_versions: [] });
      expect(getDefaultValues(method, config, HASH, LICENSE)).toMatchObject({ evm_version: [ 'default' ] });
    });

    it.each<SmartContractVerificationMethod>([ 'flattened-code', 'multi-part' ])('is empty for %s if solidity has no default', (method) => {
      const config = buildConfig({ solidity_evm_versions: [ 'london' ] });
      expect(getDefaultValues(method, config, HASH, LICENSE)).toMatchObject({ evm_version: [] });
    });

    it('preselects default for vyper-multi-part if vyper supports it', () => {
      const config = buildConfig({ solidity_evm_versions: [] });
      expect(getDefaultValues('vyper-multi-part', config, HASH, LICENSE)).toMatchObject({ evm_version: [ 'default' ] });
    });

    it('is empty for vyper-multi-part if vyper has no default', () => {
      const config = buildConfig({ vyper_evm_versions: [ 'paris' ] });
      expect(getDefaultValues('vyper-multi-part', config, HASH, LICENSE)).toMatchObject({ evm_version: [] });
    });

    it('is empty for vyper-code', () => {
      expect(getDefaultValues('vyper-code', buildConfig(), HASH, LICENSE)).toMatchObject({ evm_version: [] });
    });

    it('is absent for a method without it', () => {
      expect(getDefaultValues('standard-input', buildConfig(), HASH, LICENSE)).not.toHaveProperty('evm_version');
    });
  });

  describe('with the rust verifier microservice', () => {
    const config = buildConfig({ is_rust_verifier_microservice_enabled: true });

    it.each<SmartContractVerificationMethod>([ 'flattened-code', 'standard-input' ])('drops the name and the args autodetection for %s', (method) => {
      const result = getDefaultValues(method, config, HASH, LICENSE);

      expect(result).toHaveProperty('name', undefined);
      expect(result).toHaveProperty('autodetect_constructor_args', false);
    });

    it('keeps the name for vyper-code', () => {
      const result = getDefaultValues('vyper-code', config, HASH, LICENSE);

      expect(result).toHaveProperty('name', '');
      expect(result).not.toHaveProperty('autodetect_constructor_args');
    });

    it('adds no fields to a method without them', () => {
      expect(getDefaultValues('multi-part', config, HASH, LICENSE)).toEqual({
        ...DEFAULT_VALUES['multi-part'],
        address: HASH,
        evm_version: [ 'default' ],
        license_type: LICENSE,
      });
    });
  });

  it('keeps the name and the constructor args autodetection without the rust verifier microservice', () => {
    const result = getDefaultValues('flattened-code', buildConfig(), HASH, LICENSE);

    expect(result).toHaveProperty('name', '');
    expect(result).toHaveProperty('autodetect_constructor_args', true);
  });

  describe('with a single verification option', () => {
    const config = buildConfig({ verification_options: [ 'vyper-multi-part' ] });

    it('uses it when no method is requested', () => {
      expect(getDefaultValues(undefined, config, HASH, LICENSE)).toEqual({
        address: HASH,
        method: [ 'vyper-multi-part' ],
        compiler: [],
        evm_version: [ 'default' ],
        sources: [],
        license_type: LICENSE,
      });
    });

    it('uses it over the requested method', () => {
      expect(getDefaultValues('sourcify', config, HASH, LICENSE)).toMatchObject({ method: [ 'vyper-multi-part' ], compiler: [] });
    });
  });
});

describe('prepareRequestBody', () => {
  const file = (name: string) => new File([ 'content' ], name);
  const entries = (body: unknown) => Array.from((body as FormData).entries()).map(([ key, value ]) => [ key, value instanceof File ? value.name : value ]);

  it('builds the flattened-code body', () => {
    const body = prepareRequestBody({
      ...DEFAULT_VALUES['flattened-code'],
      address: HASH,
      name: 'Token',
      compiler: [ 'v0.8.20' ],
      evm_version: [ 'london' ],
      code: 'contract Token {}',
      constructor_args: '0x01',
      libraries: [ { name: 'Math', address: '0x02' }, { name: 'Strings', address: '0x03' } ],
      license_type: [ 'mit' ],
    } as FormFields);

    expect(body).toEqual({
      compiler_version: 'v0.8.20',
      source_code: 'contract Token {}',
      is_optimization_enabled: true,
      is_yul_contract: false,
      optimization_runs: '200',
      contract_name: 'Token',
      libraries: { Math: '0x02', Strings: '0x03' },
      evm_version: 'london',
      autodetect_constructor_args: true,
      constructor_args: '0x01',
      license_type: 'mit',
    });
  });

  it('omits the empty optional fields of the flattened-code body', () => {
    const body = prepareRequestBody({ ...DEFAULT_VALUES['flattened-code'], libraries: [ { name: '', address: '' } ] } as FormFields);

    expect(body).toMatchObject({
      compiler_version: undefined,
      contract_name: undefined,
      libraries: undefined,
      evm_version: undefined,
      license_type: 'none',
    });
  });

  it('omits the libraries of the flattened-code body if there are none', () => {
    expect(prepareRequestBody(DEFAULT_VALUES['flattened-code'])).toMatchObject({ libraries: undefined });
  });

  it('builds the standard-input body', () => {
    const body = prepareRequestBody({
      ...DEFAULT_VALUES['standard-input'],
      name: 'Token',
      compiler: [ 'v0.8.20' ],
      sources: [ file('input.json') ],
      constructor_args: '0x01',
      license_type: [ 'mit' ],
    } as FormFields);

    expect(entries(body)).toEqual([
      [ 'compiler_version', 'v0.8.20' ],
      [ 'license_type', 'mit' ],
      [ 'contract_name', 'Token' ],
      [ 'autodetect_constructor_args', 'true' ],
      [ 'constructor_args', '0x01' ],
      [ 'files[0]', 'input.json' ],
    ]);
  });

  it('adds the zk compiler to the standard-input body', () => {
    const body = prepareRequestBody({ ...DEFAULT_VALUES['standard-input'], zk_compiler: [ 'v1.5.0' ] } as FormFields);

    expect(entries(body)).toContainEqual([ 'zk_compiler_version', 'v1.5.0' ]);
    expect(entries(body)).toContainEqual([ 'license_type', 'none' ]);
  });

  it('builds the multi-part body', () => {
    const body = prepareRequestBody({
      ...DEFAULT_VALUES['multi-part'],
      compiler: [ 'v0.8.20' ],
      evm_version: [ 'london' ],
      sources: [ file('a.sol'), file('b.sol') ],
      libraries: [ { name: 'Math', address: '0x02' } ],
      license_type: [ 'mit' ],
    } as FormFields);

    expect(entries(body)).toEqual([
      [ 'compiler_version', 'v0.8.20' ],
      [ 'evm_version', 'london' ],
      [ 'license_type', 'mit' ],
      [ 'is_optimization_enabled', 'true' ],
      [ 'optimization_runs', '200' ],
      [ 'libraries', '{"Math":"0x02"}' ],
      [ 'files[0]', 'a.sol' ],
      [ 'files[1]', 'b.sol' ],
    ]);
  });

  it('omits the optimization runs and the libraries of the multi-part body when they are off', () => {
    const body = prepareRequestBody({ ...DEFAULT_VALUES['multi-part'], is_optimization_enabled: false } as FormFields);
    const keys = entries(body).map(([ key ]) => key);

    expect(entries(body)).toContainEqual([ 'is_optimization_enabled', 'false' ]);
    expect(keys).not.toContain('optimization_runs');
    expect(keys).not.toContain('libraries');
  });

  it('builds the vyper-code body', () => {
    const body = prepareRequestBody({
      ...DEFAULT_VALUES['vyper-code'],
      name: 'Token',
      compiler: [ 'v0.3.10' ],
      evm_version: [ 'paris' ],
      code: '# @version 0.3.10',
      constructor_args: '0x01',
    } as FormFields);

    expect(body).toEqual({
      compiler_version: 'v0.3.10',
      evm_version: 'paris',
      source_code: '# @version 0.3.10',
      contract_name: 'Token',
      constructor_args: '0x01',
      license_type: 'none',
    });
  });

  it('builds the vyper-multi-part body', () => {
    const body = prepareRequestBody({
      ...DEFAULT_VALUES['vyper-multi-part'],
      compiler: [ 'v0.3.10' ],
      evm_version: [ 'paris' ],
      sources: [ file('a.vy') ],
      interfaces: [ file('i.vy') ],
      license_type: [ 'mit' ],
    } as FormFields);

    expect(entries(body)).toEqual([
      [ 'compiler_version', 'v0.3.10' ],
      [ 'evm_version', 'paris' ],
      [ 'license_type', 'mit' ],
      [ 'files[0]', 'a.vy' ],
      [ 'interfaces[0]', 'i.vy' ],
    ]);
  });

  it('builds the vyper-standard-input body', () => {
    const body = prepareRequestBody({
      ...DEFAULT_VALUES['vyper-standard-input'],
      compiler: [ 'v0.3.10' ],
      sources: [ file('input.json') ],
    } as FormFields);

    expect(entries(body)).toEqual([
      [ 'compiler_version', 'v0.3.10' ],
      [ 'license_type', 'none' ],
      [ 'files[0]', 'input.json' ],
    ]);
  });

  it('builds the stylus-github-repository body', () => {
    const body = prepareRequestBody({
      ...DEFAULT_VALUES['stylus-github-repository'],
      compiler: [ 'v0.5.0' ],
      repository_url: 'https://github.com/blockscout/frontend',
      commit_hash: 'abc123',
      path_prefix: 'contracts',
      license_type: [ 'mit' ],
    } as FormFields);

    expect(body).toEqual({
      cargo_stylus_version: 'v0.5.0',
      repository_url: 'https://github.com/blockscout/frontend',
      commit: 'abc123',
      path_prefix: 'contracts',
      license_type: 'mit',
    });
  });

  it('returns an empty body for a method without a dedicated request', () => {
    expect(prepareRequestBody(DEFAULT_VALUES.sourcify)).toEqual({});
  });
});
