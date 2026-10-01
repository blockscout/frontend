// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { parentChainFull, parentChainMinimal } from '../../mocks/rollup';
import { toEnvValue } from '../../test-utils';
import { getValidationErrors } from '../../utils';
import { rollupSchema } from './rollup';

const PARENT_CHAIN = { NEXT_PUBLIC_ROLLUP_PARENT_CHAIN: toEnvValue(parentChainMinimal) };
const OPTIMISTIC = { NEXT_PUBLIC_ROLLUP_TYPE: 'optimistic', ...PARENT_CHAIN };
const ARBITRUM = { NEXT_PUBLIC_ROLLUP_TYPE: 'arbitrum', ...PARENT_CHAIN };
const SCROLL = { NEXT_PUBLIC_ROLLUP_TYPE: 'scroll', ...PARENT_CHAIN };

describe('rollupSchema', () => {
  it('accepts the optimistic rollup setup', () => {
    expect(getValidationErrors(rollupSchema, {
      ...OPTIMISTIC,
      NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL: 'https://example.com',
      NEXT_PUBLIC_FAULT_PROOF_ENABLED: 'true',
      NEXT_PUBLIC_ROLLUP_HOMEPAGE_SHOW_LATEST_BLOCKS: 'true',
      NEXT_PUBLIC_ROLLUP_OUTPUT_ROOTS_ENABLED: 'false',
      NEXT_PUBLIC_INTEROP_ENABLED: 'true',
      NEXT_PUBLIC_ROLLUP_STAGE_INDEX: '1',
      NEXT_PUBLIC_ROLLUP_LAYER_NUMBER: '5',
    })).toEqual([]);
  });

  it('accepts the arbitrum rollup setup', () => {
    expect(getValidationErrors(rollupSchema, {
      ...ARBITRUM,
      NEXT_PUBLIC_ROLLUP_HOMEPAGE_SHOW_LATEST_BLOCKS: 'true',
      NEXT_PUBLIC_ROLLUP_PARENT_CHAIN: toEnvValue(parentChainFull),
      NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE: '0x00000000000000000000000000000000000000ca1de12a9905be97beaf',
      NEXT_PUBLIC_ROLLUP_DA_CELESTIA_CELENIUM_URL: 'https://mocha.celenium.io/blob',
    })).toEqual([]);
  });

  it('requires the parent chain once a rollup type is set', () => {
    expect(getValidationErrors(rollupSchema, { NEXT_PUBLIC_ROLLUP_TYPE: 'scroll' })).toEqual([
      'NEXT_PUBLIC_ROLLUP_PARENT_CHAIN.baseUrl is a required field',
    ]);
  });

  it('rejects an unsupported rollup type', () => {
    expect(getValidationErrors(rollupSchema, { NEXT_PUBLIC_ROLLUP_TYPE: 'duck', ...PARENT_CHAIN })).toEqual([
      'NEXT_PUBLIC_ROLLUP_TYPE must be one of the following values: optimistic, arbitrum, shibarium, zkSync, scroll',
    ]);
  });

  describe('NEXT_PUBLIC_ROLLUP_PARENT_CHAIN', () => {
    it('is rejected without a rollup type', () => {
      expect(getValidationErrors(rollupSchema, PARENT_CHAIN)).toEqual([
        'NEXT_PUBLIC_ROLLUP_PARENT_CHAIN must be a `object` type, but the final value was: `"{\'baseUrl\':\'https://explorer.duckchain.io\'}"`.',
      ]);
    });

    it('rejects a chain without a base URL', () => {
      const { baseUrl, ...chain } = parentChainFull;
      expect(getValidationErrors(rollupSchema, { ...SCROLL, NEXT_PUBLIC_ROLLUP_PARENT_CHAIN: toEnvValue(chain) })).toEqual([
        'NEXT_PUBLIC_ROLLUP_PARENT_CHAIN.baseUrl is a required field',
      ]);
    });

    it('rejects a chain with a malformed RPC URL', () => {
      expect(getValidationErrors(rollupSchema, {
        ...SCROLL,
        NEXT_PUBLIC_ROLLUP_PARENT_CHAIN: toEnvValue({ ...parentChainFull, rpcUrls: [ 'not a url' ] }),
      })).toEqual([ 'NEXT_PUBLIC_ROLLUP_PARENT_CHAIN.rpcUrls[0] is not a valid URL' ]);
    });

    it('rejects a chain with a non-numeric id', () => {
      expect(getValidationErrors(rollupSchema, {
        ...SCROLL,
        NEXT_PUBLIC_ROLLUP_PARENT_CHAIN: toEnvValue({ ...parentChainFull, id: 'duck' }),
      })).toEqual([ 'NEXT_PUBLIC_ROLLUP_PARENT_CHAIN.id must be a `number` type, but the final value was: `NaN` (cast from the value `NaN`).' ]);
    });

    it('rejects a currency without a symbol', () => {
      expect(getValidationErrors(rollupSchema, {
        ...SCROLL,
        NEXT_PUBLIC_ROLLUP_PARENT_CHAIN: toEnvValue({ ...parentChainFull, currency: { name: 'Quack', decimals: 18 } }),
      })).toEqual([ 'in "currency" property symbol is a required field' ]);
    });
  });

  describe.each([
    [
      'NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL',
      'https://example.com',
      'NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL can be used only if NEXT_PUBLIC_ROLLUP_TYPE is set to \'optimistic\' ',
    ],
    [
      'NEXT_PUBLIC_ROLLUP_OUTPUT_ROOTS_ENABLED',
      'true',
      'NEXT_PUBLIC_ROLLUP_OUTPUT_ROOTS_ENABLED can only be used if NEXT_PUBLIC_ROLLUP_TYPE is set to \'optimistic\' ',
    ],
    [ 'NEXT_PUBLIC_INTEROP_ENABLED', 'true', 'NEXT_PUBLIC_INTEROP_ENABLED can only be used if NEXT_PUBLIC_ROLLUP_TYPE is set to \'optimistic\' ' ],
    [ 'NEXT_PUBLIC_FAULT_PROOF_ENABLED', 'true', 'NEXT_PUBLIC_FAULT_PROOF_ENABLED can only be used with NEXT_PUBLIC_ROLLUP_TYPE=optimistic' ],
  ])('%s', (name, value, message) => {
    it('is accepted for the optimistic rollup', () => {
      expect(getValidationErrors(rollupSchema, { ...OPTIMISTIC, [name]: value })).toEqual([]);
    });

    it('is rejected for the arbitrum rollup', () => {
      expect(getValidationErrors(rollupSchema, { ...ARBITRUM, [name]: value })).toEqual([ message ]);
    });
  });

  describe.each([
    [
      'NEXT_PUBLIC_ROLLUP_HOMEPAGE_SHOW_LATEST_BLOCKS',
      'true',
      'NEXT_PUBLIC_ROLLUP_HOMEPAGE_SHOW_LATEST_BLOCKS cannot not be used if NEXT_PUBLIC_ROLLUP_TYPE is not defined',
    ],
    [ 'NEXT_PUBLIC_ROLLUP_STAGE_INDEX', '2', 'NEXT_PUBLIC_ROLLUP_STAGE_INDEX can only be used with NEXT_PUBLIC_ROLLUP_TYPE' ],
    [ 'NEXT_PUBLIC_ROLLUP_LAYER_NUMBER', '3', 'NEXT_PUBLIC_ROLLUP_LAYER_NUMBER can only be used with NEXT_PUBLIC_ROLLUP_TYPE' ],
  ])('%s', (name, value, message) => {
    it('is accepted for any rollup type', () => {
      expect(getValidationErrors(rollupSchema, { ...SCROLL, [name]: value })).toEqual([]);
    });

    it('is rejected without a rollup type', () => {
      expect(getValidationErrors(rollupSchema, { [name]: value })).toEqual([ message ]);
    });
  });

  it('rejects a malformed L2 withdrawal URL', () => {
    expect(getValidationErrors(rollupSchema, { ...OPTIMISTIC, NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL: 'not a url' })).toEqual([
      'NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL is not a valid URL',
    ]);
  });

  it('rejects a non-boolean fault proof flag', () => {
    expect(getValidationErrors(rollupSchema, { ...OPTIMISTIC, NEXT_PUBLIC_FAULT_PROOF_ENABLED: 'yes' })).toEqual([
      'NEXT_PUBLIC_FAULT_PROOF_ENABLED must be a `boolean` type, but the final value was: `"yes"`.',
    ]);
  });

  describe('NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE', () => {
    it('is rejected for the optimistic rollup', () => {
      expect(getValidationErrors(rollupSchema, {
        ...OPTIMISTIC,
        NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE: '0x00000000000000000000000000000000000000ca1de12a9905be97beaf',
      })).toEqual([ 'NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE can only be used if NEXT_PUBLIC_ROLLUP_TYPE is set to \'arbitrum\' ' ]);
    });

    it('rejects a namespace of the wrong length', () => {
      expect(getValidationErrors(rollupSchema, { ...ARBITRUM, NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE: '0xca1de12a' })).toEqual([
        'NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE must be at least 60 characters',
      ]);
    });

    it('rejects a namespace that is not a hex string', () => {
      expect(getValidationErrors(rollupSchema, {
        ...ARBITRUM,
        NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE: '0x0000000000000000000000000000000000000000ca1de12a9905be97zzzz',
      })).toEqual([
        'NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE must be at most 60 characters',
        'NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE must match the following: "/^0x[\\da-fA-F]+$/"',
      ]);
    });
  });

  describe('NEXT_PUBLIC_ROLLUP_DA_CELESTIA_CELENIUM_URL', () => {
    it.each([ 'optimistic', 'arbitrum' ])('is accepted for the %s rollup', (type) => {
      expect(getValidationErrors(rollupSchema, {
        ...PARENT_CHAIN,
        NEXT_PUBLIC_ROLLUP_TYPE: type,
        NEXT_PUBLIC_ROLLUP_DA_CELESTIA_CELENIUM_URL: 'https://mocha.celenium.io/blob',
      })).toEqual([]);
    });

    it('is rejected for the scroll rollup', () => {
      expect(getValidationErrors(rollupSchema, { ...SCROLL, NEXT_PUBLIC_ROLLUP_DA_CELESTIA_CELENIUM_URL: 'https://mocha.celenium.io/blob' })).toEqual([
        'NEXT_PUBLIC_ROLLUP_DA_CELESTIA_CELENIUM_URL can only be used if NEXT_PUBLIC_ROLLUP_TYPE is set to \'arbitrum\' or \'optimistic\'',
      ]);
    });

    it('is rejected when malformed', () => {
      expect(getValidationErrors(rollupSchema, { ...ARBITRUM, NEXT_PUBLIC_ROLLUP_DA_CELESTIA_CELENIUM_URL: 'not a url' })).toEqual([
        'NEXT_PUBLIC_ROLLUP_DA_CELESTIA_CELENIUM_URL is not a valid URL',
      ]);
    });
  });

  it('rejects an unsupported stage index', () => {
    expect(getValidationErrors(rollupSchema, { ...OPTIMISTIC, NEXT_PUBLIC_ROLLUP_STAGE_INDEX: '3' })).toEqual([
      'NEXT_PUBLIC_ROLLUP_STAGE_INDEX must be one of the following values: 1, 2',
    ]);
  });

  it('rejects a layer number below 2', () => {
    expect(getValidationErrors(rollupSchema, { ...OPTIMISTIC, NEXT_PUBLIC_ROLLUP_LAYER_NUMBER: '1' })).toEqual([
      'NEXT_PUBLIC_ROLLUP_LAYER_NUMBER must be greater than or equal to 2',
    ]);
  });

  it('rejects a non-integer layer number', () => {
    expect(getValidationErrors(rollupSchema, { ...OPTIMISTIC, NEXT_PUBLIC_ROLLUP_LAYER_NUMBER: '2.5' })).toEqual([
      'NEXT_PUBLIC_ROLLUP_LAYER_NUMBER must be an integer',
    ]);
  });
});
