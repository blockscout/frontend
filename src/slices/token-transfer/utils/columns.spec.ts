// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getAvailableColumns, getDefaultColumnIds } from './columns';

const ALL_COLUMNS = [ 'tx_hash', 'type', 'transfer_type', 'method', 'timestamp', 'block', 'from_to', 'amount', 'asset', 'value' ];

describe('getAvailableColumns', () => {
  it('offers the whole vocabulary in order on the index, address and token surfaces', () => {
    expect(getAvailableColumns('index').map(({ id }) => id)).toEqual(ALL_COLUMNS);
    expect(getAvailableColumns('address').map(({ id }) => id)).toEqual(ALL_COLUMNS);
    expect(getAvailableColumns('token').map(({ id }) => id)).toEqual(ALL_COLUMNS);
  });

  it('does not offer the hash, method, timestamp and block columns on the tx surface', () => {
    expect(getAvailableColumns('tx').map(({ id }) => id)).toEqual(
      [ 'type', 'transfer_type', 'from_to', 'amount', 'asset', 'value' ],
    );
  });

  it('names the columns for display', () => {
    expect(getAvailableColumns('index').map(({ name }) => name)).toEqual(
      [ 'Txn hash', 'Token type', 'Transfer type', 'Method', 'Timestamp', 'Block', 'From / To', 'Amount', 'ID / Asset', 'Value' ],
    );
  });

  it('marks only amount and value as numeric', () => {
    expect(getAvailableColumns('index').filter(({ isNumeric }) => isNumeric).map(({ id }) => id)).toEqual([ 'amount', 'value' ]);
  });
});

describe('getDefaultColumnIds', () => {
  it('shows every column by default on the index and address surfaces', () => {
    expect(getDefaultColumnIds('index')).toEqual(ALL_COLUMNS);
    expect(getDefaultColumnIds('address')).toEqual(ALL_COLUMNS);
  });

  it('hides the type columns and block by default on the token surface', () => {
    expect(getDefaultColumnIds('token')).toEqual(
      [ 'tx_hash', 'method', 'timestamp', 'from_to', 'amount', 'asset', 'value' ],
    );
  });

  it('shows every available column by default on the tx surface', () => {
    expect(getDefaultColumnIds('tx')).toEqual(
      [ 'type', 'transfer_type', 'from_to', 'amount', 'asset', 'value' ],
    );
  });

  it('returns the same reference on every call so it can be used as a prop', () => {
    expect(getDefaultColumnIds('index')).toBe(getDefaultColumnIds('index'));
  });
});
