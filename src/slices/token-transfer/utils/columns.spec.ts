// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import { chainA } from 'src/features/multichain/mocks/chains';

import { getAvailableColumns, getDefaultColumnIds } from 'src/shared/lists/columns/column-overrides';

import { describe, expect, it } from 'vitest';

import type { SurfaceColumnStatesParams } from './columns';
import { getSurfaceColumnStates, TOKEN_TRANSFER_COLUMNS } from './columns';

const chainWithoutErc8056 = chainA.app_config as ClusterChainConfig['app_config'];

const chainWithErc8056 = {
  ...chainWithoutErc8056,
  slices: {
    ...chainWithoutErc8056.slices,
    token: {
      ...chainWithoutErc8056.slices.token,
      additionalTypes: [ { id: 'ERC-8056', name: 'ERC-8056' } ],
    },
  },
} as ClusterChainConfig['app_config'];

const ALL_COLUMNS = [ 'in_out', 'tx_hash', 'type', 'transfer_type', 'method', 'timestamp', 'block', 'from_to', 'multiplier', 'amount', 'asset', 'value' ];
const WITHOUT_IN_OUT = ALL_COLUMNS.filter((id) => id !== 'in_out');
const WITHOUT_IN_OUT_AND_MULTIPLIER = WITHOUT_IN_OUT.filter((id) => id !== 'multiplier');
const MULTIPLIER_ENABLED: SurfaceColumnStatesParams = { chainConfig: chainWithErc8056 };

const getAvailableIds = (...args: Parameters<typeof getSurfaceColumnStates>) =>
  getAvailableColumns(TOKEN_TRANSFER_COLUMNS, getSurfaceColumnStates(...args)).map(({ id }) => id);
const getDefaultIds = (...args: Parameters<typeof getSurfaceColumnStates>) =>
  getDefaultColumnIds(TOKEN_TRANSFER_COLUMNS, getSurfaceColumnStates(...args));

describe('TOKEN_TRANSFER_COLUMNS', () => {
  it('names the columns for display, in vocabulary order', () => {
    expect(TOKEN_TRANSFER_COLUMNS.map(({ name }) => name)).toEqual(
      [ 'In / Out', 'Txn hash', 'Token type', 'Transfer type', 'Method', 'Timestamp', 'Block', 'From / To', 'Multiplier', 'Amount', 'ID / Asset', 'Value' ],
    );
  });

  it('marks only multiplier, amount and value as numeric', () => {
    expect(TOKEN_TRANSFER_COLUMNS.filter(({ isNumeric }) => isNumeric).map(({ id }) => id)).toEqual([ 'multiplier', 'amount', 'value' ]);
  });
});

describe('getSurfaceColumnStates', () => {
  it('offers the whole vocabulary in order on the address surface, In / Out first', () => {
    expect(getAvailableIds('address', MULTIPLIER_ENABLED)).toEqual(ALL_COLUMNS);
  });

  it('offers every column but In / Out on the index surface', () => {
    expect(getAvailableIds('index', MULTIPLIER_ENABLED)).toEqual(WITHOUT_IN_OUT);
  });

  it('offers every column but In / Out on the token surface of an ERC-8056 token', () => {
    expect(getAvailableIds('token', { ...MULTIPLIER_ENABLED, tokenType: 'ERC-8056' })).toEqual(WITHOUT_IN_OUT);
  });

  it('does not offer In / Out on the index, token and tx surfaces', () => {
    expect(getSurfaceColumnStates('index', MULTIPLIER_ENABLED).in_out).toBe('unavailable');
    expect(getSurfaceColumnStates('token', MULTIPLIER_ENABLED).in_out).toBe('unavailable');
    expect(getSurfaceColumnStates('tx', MULTIPLIER_ENABLED).in_out).toBe('unavailable');
  });

  it('does not offer the hash, method, timestamp and block columns on the tx surface', () => {
    expect(getAvailableIds('tx', MULTIPLIER_ENABLED)).toEqual(
      [ 'type', 'transfer_type', 'from_to', 'multiplier', 'amount', 'asset', 'value' ],
    );
  });

  it('shows every available column by default on the index and address surfaces', () => {
    expect(getDefaultIds('index', MULTIPLIER_ENABLED)).toEqual(WITHOUT_IN_OUT);
    expect(getDefaultIds('address', MULTIPLIER_ENABLED)).toEqual(ALL_COLUMNS);
  });

  it('hides the type columns and block by default on the token surface', () => {
    expect(getDefaultIds('token', { ...MULTIPLIER_ENABLED, tokenType: 'ERC-8056' })).toEqual(
      [ 'tx_hash', 'method', 'timestamp', 'from_to', 'multiplier', 'amount', 'asset', 'value' ],
    );
  });

  it('shows every available column by default on the tx surface', () => {
    expect(getDefaultIds('tx', MULTIPLIER_ENABLED)).toEqual(
      [ 'type', 'transfer_type', 'from_to', 'multiplier', 'amount', 'asset', 'value' ],
    );
  });

  describe('multiplier', () => {
    it('is on when the chain enables ERC-8056 and nothing narrows it', () => {
      expect(getSurfaceColumnStates('index', MULTIPLIER_ENABLED).multiplier).toBe('on');
    });

    it('is unavailable when the chain does not enable ERC-8056', () => {
      expect(getSurfaceColumnStates('index', { chainConfig: chainWithoutErc8056 }).multiplier).toBe('unavailable');
    });

    it('follows the instance config when no chain config is given', () => {
      expect(getSurfaceColumnStates('index', {}).multiplier).toBe('unavailable');
    });

    it('is on when the type filter includes ERC-8056', () => {
      expect(getSurfaceColumnStates('address', { ...MULTIPLIER_ENABLED, typeFilter: [ 'ERC-20', 'ERC-8056' ] }).multiplier).toBe('on');
    });

    it('is on when the type filter is empty', () => {
      expect(getSurfaceColumnStates('address', { ...MULTIPLIER_ENABLED, typeFilter: [] }).multiplier).toBe('on');
    });

    it('is unavailable when the type filter is set without ERC-8056', () => {
      expect(getSurfaceColumnStates('address', { ...MULTIPLIER_ENABLED, typeFilter: [ 'ERC-20' ] }).multiplier).toBe('unavailable');
    });

    it('ignores the token type outside the token surface', () => {
      expect(getSurfaceColumnStates('tx', { ...MULTIPLIER_ENABLED, tokenType: 'ERC-20' }).multiplier).toBe('on');
    });

    it('is unavailable on the token surface of a token of another type', () => {
      expect(getSurfaceColumnStates('token', { ...MULTIPLIER_ENABLED, tokenType: 'ERC-20' }).multiplier).toBe('unavailable');
    });

    it('is unavailable on the token surface while the token is unknown', () => {
      expect(getSurfaceColumnStates('token', MULTIPLIER_ENABLED).multiplier).toBe('unavailable');
    });

    it('leaves the other columns unchanged when unavailable', () => {
      expect(getAvailableIds('index', { chainConfig: chainWithoutErc8056 })).toEqual(WITHOUT_IN_OUT_AND_MULTIPLIER);
      expect(getDefaultIds('index', { chainConfig: chainWithoutErc8056 })).toEqual(WITHOUT_IN_OUT_AND_MULTIPLIER);
    });
  });
});
