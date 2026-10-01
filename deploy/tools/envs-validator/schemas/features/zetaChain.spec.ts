// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { zetaChainChainsConfig, zetaChainExternalSearchConfig } from '../../mocks/zetaChain';
import { toEnvValue } from '../../test-utils';
import { getValidationErrors } from '../../utils';
import { zetaChainSchema } from './zetaChain';

const REQUIRED = {
  NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST: 'https://zetachain-indexer.duckdns.org',
  NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL: JSON.stringify(zetaChainChainsConfig),
};

describe('zetaChainSchema', () => {
  it('accepts the API host with the chains config and the external search config', () => {
    expect(getValidationErrors(zetaChainSchema, {
      ...REQUIRED,
      NEXT_PUBLIC_ZETACHAIN_EXTERNAL_SEARCH_CONFIG: toEnvValue(zetaChainExternalSearchConfig),
    })).toEqual([]);
  });

  it('rejects the API host without the chains config', () => {
    expect(getValidationErrors(zetaChainSchema, { NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST: 'https://zetachain-indexer.duckdns.org' })).toEqual([
      'NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST cannot be used without NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL',
    ]);
  });

  it('rejects a malformed API host', () => {
    expect(getValidationErrors(zetaChainSchema, { ...REQUIRED, NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST: 'not a url' })).toEqual([
      'NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST: Invalid URL: Received "not a url"',
    ]);
  });

  describe('NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL', () => {
    it('is rejected without the API host', () => {
      expect(getValidationErrors(zetaChainSchema, {
        NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL: JSON.stringify(zetaChainChainsConfig),
      })).toEqual([ 'NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL cannot be used if NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST is not set' ]);
    });

    it('rejects a chain without an id', () => {
      expect(getValidationErrors(zetaChainSchema, {
        ...REQUIRED,
        NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL: JSON.stringify([ { chain_name: 'ZetaChain Athens' } ]),
      })).toEqual([ 'NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL.0.chain_id: Invalid key: Expected "chain_id" but received undefined' ]);
    });

    it('rejects a chain with a non-numeric id', () => {
      expect(getValidationErrors(zetaChainSchema, {
        ...REQUIRED,
        NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL: JSON.stringify([ { ...zetaChainChainsConfig[0], chain_id: 'athens' } ]),
      })).toEqual([
        'NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL.0.chain_id: Invalid type: Expected number but received "athens"',
      ]);
    });

    it('rejects a chain with a malformed instance URL', () => {
      expect(getValidationErrors(zetaChainSchema, {
        ...REQUIRED,
        NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL: JSON.stringify([ { ...zetaChainChainsConfig[0], instance_url: 'not a url' } ]),
      })).toEqual([ 'NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL.0.instance_url: Invalid URL: Received "not a url"' ]);
    });
  });

  describe('NEXT_PUBLIC_ZETACHAIN_EXTERNAL_SEARCH_CONFIG', () => {
    it('is rejected without the API host', () => {
      expect(getValidationErrors(zetaChainSchema, {
        NEXT_PUBLIC_ZETACHAIN_EXTERNAL_SEARCH_CONFIG: toEnvValue(zetaChainExternalSearchConfig),
      })).toEqual([ 'NEXT_PUBLIC_ZETACHAIN_EXTERNAL_SEARCH_CONFIG cannot be used if NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST is not set' ]);
    });

    it('rejects an entry without a template', () => {
      const { template, ...entry } = zetaChainExternalSearchConfig[0];
      expect(getValidationErrors(zetaChainSchema, {
        ...REQUIRED,
        NEXT_PUBLIC_ZETACHAIN_EXTERNAL_SEARCH_CONFIG: toEnvValue([ entry ]),
      })).toEqual([ 'NEXT_PUBLIC_ZETACHAIN_EXTERNAL_SEARCH_CONFIG.0.template: Invalid key: Expected "template" but received undefined' ]);
    });
  });
});
