// SPDX-License-Identifier: LicenseRef-Blockscout

import type { StatsApiResourceNameRefetchInterval } from 'src/features/chain-stats/types/config';

import { describe, expect, it } from 'vitest';

import { toEnvValue } from '../test-utils';
import { getValidationErrors } from '../utils';
import apisSchema from './apis';

const REQUIRED = { NEXT_PUBLIC_API_HOST: 'blockscout.com' };

const refetchInterval: Record<StatsApiResourceNameRefetchInterval, number> = {
  'stats:counters': 10_000,
  'stats:pages_main': 10_000,
};

describe('apisSchema', () => {
  it('accepts the core API settings', () => {
    expect(getValidationErrors(apisSchema, {
      ...REQUIRED,
      NEXT_PUBLIC_API_PROTOCOL: 'https',
      NEXT_PUBLIC_API_PORT: '443',
      NEXT_PUBLIC_API_BASE_PATH: '/',
      NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL: 'wss',
    })).toEqual([]);
  });

  it('requires the API host', () => {
    expect(getValidationErrors(apisSchema, {})).toEqual([ 'NEXT_PUBLIC_API_HOST is a required field' ]);
  });

  it('rejects an unsupported protocol', () => {
    expect(getValidationErrors(apisSchema, { ...REQUIRED, NEXT_PUBLIC_API_PROTOCOL: 'ftp' })).toEqual([
      'NEXT_PUBLIC_API_PROTOCOL must be one of the following values: http, https',
    ]);
    expect(getValidationErrors(apisSchema, { ...REQUIRED, NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL: 'http' })).toEqual([
      'NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL must be one of the following values: ws, wss',
    ]);
  });

  it('rejects a port that is not a positive integer', () => {
    expect(getValidationErrors(apisSchema, { ...REQUIRED, NEXT_PUBLIC_API_PORT: '-1' })).toEqual([
      'NEXT_PUBLIC_API_PORT must be a positive number',
    ]);
    expect(getValidationErrors(apisSchema, { ...REQUIRED, NEXT_PUBLIC_API_PORT: '1.5' })).toEqual([
      'NEXT_PUBLIC_API_PORT must be an integer',
    ]);
  });

  describe('stats API', () => {
    it('accepts the host with a refetch interval', () => {
      expect(getValidationErrors(apisSchema, {
        ...REQUIRED,
        NEXT_PUBLIC_STATS_API_HOST: 'https://stats.example.com',
        NEXT_PUBLIC_STATS_API_BASE_PATH: '/',
        NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL: toEnvValue(refetchInterval),
      })).toEqual([]);
    });

    it('rejects a refetch interval that is not a positive integer', () => {
      expect(getValidationErrors(apisSchema, {
        ...REQUIRED,
        NEXT_PUBLIC_STATS_API_HOST: 'https://stats.example.com',
        NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL: toEnvValue({ 'stats:counters': -1 }),
      })).toEqual([
        'Invalid schema was provided for NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL: stats:counters must be a positive number',
      ]);
    });

    it('rejects an unknown resource in the refetch interval', () => {
      expect(getValidationErrors(apisSchema, {
        ...REQUIRED,
        NEXT_PUBLIC_STATS_API_HOST: 'https://stats.example.com',
        NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL: toEnvValue({ 'stats:unknown': 1 }),
      })).toEqual([
        'Invalid schema was provided for NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL: this object contains unknown properties: stats:unknown',
      ]);
    });

    it('rejects the refetch interval without the host', () => {
      expect(getValidationErrors(apisSchema, {
        ...REQUIRED,
        NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL: toEnvValue(refetchInterval),
      })).toEqual([ 'NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL can only be used with NEXT_PUBLIC_STATS_API_HOST' ]);
    });
  });

  describe.each([
    [ 'NEXT_PUBLIC_CONTRACT_INFO_INSTANCE_ID', 'NEXT_PUBLIC_CONTRACT_INFO_API_HOST', '420:duck' ],
    [ 'NEXT_PUBLIC_ADMIN_RS_INSTANCE_ID', 'NEXT_PUBLIC_ADMIN_SERVICE_API_HOST', '420:duck' ],
  ])('%s', (dependent, host, value) => {
    it(`is accepted together with ${ host }`, () => {
      expect(getValidationErrors(apisSchema, { ...REQUIRED, [host]: 'https://example.com', [dependent]: value })).toEqual([]);
    });

    it(`is rejected without ${ host }`, () => {
      expect(getValidationErrors(apisSchema, { ...REQUIRED, [dependent]: value })).toEqual([
        `${ dependent } can only be used with ${ host }`,
      ]);
    });
  });

  describe('metadata service', () => {
    it('accepts the tags update flag together with the host', () => {
      expect(getValidationErrors(apisSchema, {
        ...REQUIRED,
        NEXT_PUBLIC_METADATA_SERVICE_API_HOST: 'https://example.com',
        NEXT_PUBLIC_METADATA_ADDRESS_TAGS_UPDATE_ENABLED: 'false',
      })).toEqual([]);
    });

    it('rejects the tags update flag without the host', () => {
      expect(getValidationErrors(apisSchema, { ...REQUIRED, NEXT_PUBLIC_METADATA_ADDRESS_TAGS_UPDATE_ENABLED: 'true' })).toEqual([
        'NEXT_PUBLIC_METADATA_ADDRESS_TAGS_UPDATE_ENABLED cannot not be used if NEXT_PUBLIC_METADATA_SERVICE_API_HOST is not defined',
      ]);
    });
  });

  it.each([
    'NEXT_PUBLIC_STATS_API_HOST',
    'NEXT_PUBLIC_VISUALIZE_API_HOST',
    'NEXT_PUBLIC_CONTRACT_INFO_API_HOST',
    'NEXT_PUBLIC_ADMIN_SERVICE_API_HOST',
    'NEXT_PUBLIC_REWARDS_SERVICE_API_HOST',
    'NEXT_PUBLIC_METADATA_SERVICE_API_HOST',
  ])('rejects a malformed %s', (name) => {
    expect(getValidationErrors(apisSchema, { ...REQUIRED, [name]: 'not a url' })).toEqual([ `${ name } is not a valid URL` ]);
  });
});
