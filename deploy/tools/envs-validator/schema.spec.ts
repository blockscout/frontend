// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { singleChainConfig, txExternalTxsConfig } from './mocks/instance';
import schema from './schema';
import { toEnvValue } from './test-utils';
import { getValidationErrors } from './utils';

const REQUIRED = {
  NEXT_PUBLIC_APP_HOST: 'localhost',
  NEXT_PUBLIC_API_HOST: 'blockscout.com',
  NEXT_PUBLIC_NETWORK_NAME: 'Testnet',
  NEXT_PUBLIC_NETWORK_ID: '1',
};

describe('single-chain schema', () => {
  it('accepts a full known-good configuration', () => {
    expect(getValidationErrors(schema, singleChainConfig)).toEqual([]);
  });

  it('requires the app host, API host, network name and network id', () => {
    expect(getValidationErrors(schema, {}).sort()).toEqual([
      'NEXT_PUBLIC_API_HOST is a required field',
      'NEXT_PUBLIC_APP_HOST is a required field',
      'NEXT_PUBLIC_NETWORK_ID is a required field',
      'NEXT_PUBLIC_NETWORK_NAME is a required field',
    ]);
  });

  it('rejects an unknown variable', () => {
    expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_DUCK: 'quack' })).toEqual([
      'Unknown ENV variables were provided: NEXT_PUBLIC_DUCK',
    ]);
  });

  describe('cross-schema dependencies', () => {
    it('accepts DEX pools together with the contract info API host', () => {
      expect(getValidationErrors(schema, {
        ...REQUIRED,
        NEXT_PUBLIC_DEX_POOLS_ENABLED: 'true',
        NEXT_PUBLIC_CONTRACT_INFO_API_HOST: 'https://example.com',
      })).toEqual([]);
    });

    it('rejects DEX pools without the contract info API host', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_DEX_POOLS_ENABLED: 'true' })).toEqual([
        'NEXT_PUBLIC_DEX_POOLS_ENABLED can only be used with NEXT_PUBLIC_CONTRACT_INFO_API_HOST',
      ]);
    });

    it('accepts the operational txs chart together with the stats API host', () => {
      expect(getValidationErrors(schema, {
        ...REQUIRED,
        NEXT_PUBLIC_HOMEPAGE_CHARTS: toEnvValue([ 'daily_operational_txs' ]),
        NEXT_PUBLIC_STATS_API_HOST: 'https://example.com',
      })).toEqual([]);
    });

    it('rejects the operational txs chart without the stats API host', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_HOMEPAGE_CHARTS: toEnvValue([ 'daily_operational_txs' ]) })).toEqual([
        'NEXT_PUBLIC_STATS_API_HOST is required when daily_operational_txs is enabled in NEXT_PUBLIC_HOMEPAGE_CHARTS',
      ]);
    });

    it('accepts the operational txs stat together with the stats API host', () => {
      expect(getValidationErrors(schema, {
        ...REQUIRED,
        NEXT_PUBLIC_HOMEPAGE_STATS: toEnvValue([ 'total_operational_txs' ]),
        NEXT_PUBLIC_STATS_API_HOST: 'https://example.com',
      })).toEqual([]);
    });

    it('rejects the operational txs stat without the stats API host', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_HOMEPAGE_STATS: toEnvValue([ 'total_operational_txs' ]) })).toEqual([
        'NEXT_PUBLIC_STATS_API_HOST is required when total_operational_txs is enabled in NEXT_PUBLIC_HOMEPAGE_STATS',
      ]);
    });

    it('accepts the verification type for a non-Arbitrum rollup', () => {
      expect(getValidationErrors(schema, {
        ...REQUIRED,
        NEXT_PUBLIC_ROLLUP_TYPE: 'optimistic',
        NEXT_PUBLIC_ROLLUP_PARENT_CHAIN: toEnvValue({ baseUrl: 'https://example.com' }),
        NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE: 'validation',
      })).toEqual([]);
    });

    it('rejects the verification type for an Arbitrum rollup', () => {
      expect(getValidationErrors(schema, {
        ...REQUIRED,
        NEXT_PUBLIC_ROLLUP_TYPE: 'arbitrum',
        NEXT_PUBLIC_ROLLUP_PARENT_CHAIN: toEnvValue({ baseUrl: 'https://example.com' }),
        NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE: 'validation',
      })).toEqual([ 'NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE can not be set for Arbitrum rollups' ]);
    });

    it('rejects the zetaChain API host without the chains config', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST: 'https://example.com' })).toEqual([
        'NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST cannot be used without NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL',
      ]);
    });
  });

  describe('NEXT_PUBLIC_WEB3_WALLETS', () => {
    it('accepts a list of supported wallets or the "none" literal', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_WEB3_WALLETS: toEnvValue([ 'metamask', 'coinbase' ]) })).toEqual([]);
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_WEB3_WALLETS: 'none' })).toEqual([]);
    });

    it('rejects an unsupported wallet', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_WEB3_WALLETS: toEnvValue([ 'duck_wallet' ]) })).toEqual([
        'Invalid schema were provided for NEXT_PUBLIC_WEB3_WALLETS, it should be either array or "none" string literal',
      ]);
    });
  });

  describe('NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG', () => {
    it('accepts a provider with a name and url template', () => {
      expect(getValidationErrors(schema, {
        ...REQUIRED,
        NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG: toEnvValue({ name: 'Need gas?', url_template: 'https://example.com/{chainId}' }),
      })).toEqual([]);
    });

    it('rejects a provider without a url template', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG: toEnvValue({ name: 'Need gas?' }) })).toEqual([
        'Invalid schema were provided for NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG, it should have name and url template',
      ]);
    });
  });

  describe('NEXT_PUBLIC_ADDRESS_USERNAME_TAG', () => {
    it('accepts a config with an api url template', () => {
      expect(getValidationErrors(schema, {
        ...REQUIRED,
        NEXT_PUBLIC_ADDRESS_USERNAME_TAG: toEnvValue({ api_url_template: 'https://example.com/{address}', tag_icon: 'https://example.com/icon.svg' }),
      })).toEqual([]);
    });

    it('rejects a config without an api url template', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_ADDRESS_USERNAME_TAG: toEnvValue({ tag_icon: 'https://example.com/icon.svg' }) })).toEqual([
        'Invalid schema were provided for NEXT_PUBLIC_ADDRESS_USERNAME_TAG, it should have api_url_template',
      ]);
    });
  });

  describe('NEXT_PUBLIC_TX_EXTERNAL_TRANSACTIONS_CONFIG', () => {
    it('accepts a full config', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_TX_EXTERNAL_TRANSACTIONS_CONFIG: toEnvValue(txExternalTxsConfig) })).toEqual([]);
    });

    it('rejects a config without the explorer url template', () => {
      const incomplete = { chain_name: txExternalTxsConfig.chain_name, chain_logo_url: txExternalTxsConfig.chain_logo_url };
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_TX_EXTERNAL_TRANSACTIONS_CONFIG: toEnvValue(incomplete) })).toEqual([
        'Invalid schema were provided for NEXT_PUBLIC_TX_EXTERNAL_TRANSACTIONS_CONFIG, it should have chain_name, chain_logo_url, and explorer_url_template',
      ]);
    });
  });

  describe('Usercentrics', () => {
    it('accepts the config together with the draft flag', () => {
      expect(getValidationErrors(schema, {
        ...REQUIRED,
        NEXT_PUBLIC_USERCENTRICS_CONFIG: toEnvValue({ settingsId: 'xxx' }),
        NEXT_PUBLIC_USERCENTRICS_DRAFT: 'true',
      })).toEqual([]);
    });

    it('rejects a config that is not an object', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_USERCENTRICS_CONFIG: 'xxx' })).toEqual([
        'Invalid schema for NEXT_PUBLIC_USERCENTRICS_CONFIG, it should have settingsId or rulesetId',
      ]);
    });

    it('rejects the draft flag without the config', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_USERCENTRICS_DRAFT: 'true' })).toEqual([
        'NEXT_PUBLIC_USERCENTRICS_DRAFT can only be used with NEXT_PUBLIC_USERCENTRICS_CONFIG',
      ]);
    });
  });

  describe('enumerated values', () => {
    it('accepts a supported value', () => {
      expect(getValidationErrors(schema, {
        ...REQUIRED,
        NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER: 'blockscout',
        NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE: 'stability',
        NEXT_PUBLIC_GAS_TRACKER_UNITS: toEnvValue([ 'gwei', 'usd' ]),
        NEXT_PUBLIC_APP_PROTOCOL: 'https',
        NEXT_PUBLIC_APP_PORT: '3000',
      })).toEqual([]);
    });

    it('rejects an unsupported transaction interpretation provider', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER: 'duck' })).toEqual([
        'NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER must be one of the following values: blockscout, noves, none',
      ]);
    });

    it('rejects an unsupported validators chain type', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE: 'duck' })).toEqual([
        'NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE must be one of the following values: stability, blackfort, zilliqa',
      ]);
    });

    it('rejects an unsupported gas tracker unit', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_GAS_TRACKER_UNITS: toEnvValue([ 'eth' ]) })).toEqual([
        'NEXT_PUBLIC_GAS_TRACKER_UNITS[0] must be one of the following values: usd, gwei',
      ]);
    });

    it('rejects an unsupported app protocol', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_APP_PROTOCOL: 'ftp' })).toEqual([
        'NEXT_PUBLIC_APP_PROTOCOL must be one of the following values: http, https',
      ]);
    });

    it('rejects an app port that is not a positive integer', () => {
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_APP_PORT: '-1' })).toEqual([ 'NEXT_PUBLIC_APP_PORT must be a positive number' ]);
      expect(getValidationErrors(schema, { ...REQUIRED, NEXT_PUBLIC_APP_PORT: '1.5' })).toEqual([ 'NEXT_PUBLIC_APP_PORT must be an integer' ]);
    });
  });

  it.each([
    'NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET',
    'NEXT_PUBLIC_IS_SUAVE_CHAIN',
    'NEXT_PUBLIC_METASUITES_ENABLED',
    'NEXT_PUBLIC_GAS_TRACKER_ENABLED',
    'NEXT_PUBLIC_DATA_AVAILABILITY_ENABLED',
    'NEXT_PUBLIC_ADVANCED_FILTER_ENABLED',
    'NEXT_PUBLIC_CELO_ENABLED',
    'NEXT_PUBLIC_HOT_CONTRACTS_ENABLED',
    'NEXT_PUBLIC_PRO_API_SUPPORTED',
    'NEXT_PUBLIC_USE_NEXT_JS_PROXY',
  ])('rejects a non-boolean %s', (name) => {
    expect(getValidationErrors(schema, { ...REQUIRED, [name]: 'yes' })).toEqual([
      `${ name } must be a \`boolean\` type, but the final value was: \`"yes"\`.`,
    ]);
  });
});
