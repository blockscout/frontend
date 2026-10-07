// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ColumnStates } from './types';

import { describe, expect, it } from 'vitest';

import {
  getAvailableColumns,
  getDefaultColumnIds,
  getOrderedColumns,
  getVisibleColumnIds,
  parseColumnOverrides,
  serializeColumnOverrides,
  setColumnOrder,
  setColumnVisibility,
} from './column-overrides';

type ColumnId = 'hash' | 'block' | 'from' | 'amount' | 'fee';

const COLUMNS = [
  { id: 'hash' as const, name: 'Hash' },
  { id: 'block' as const, name: 'Block' },
  { id: 'from' as const, name: 'From' },
  { id: 'amount' as const, name: 'Amount' },
  { id: 'fee' as const, name: 'Fee' },
];
const COLUMN_IDS = COLUMNS.map(({ id }) => id);

const STATES: ColumnStates<ColumnId> = { hash: 'on', block: 'off', from: 'on', amount: 'on', fee: 'unavailable' };
const AVAILABLE_COLUMNS = getAvailableColumns(COLUMNS, STATES);

const getOrderedIds = (order: ReadonlyArray<ColumnId> | undefined) => getOrderedColumns(AVAILABLE_COLUMNS, order).map(({ id }) => id);

describe('parseColumnOverrides', () => {
  it('reads nothing stored as no overrides', () => {
    expect(parseColumnOverrides(null, COLUMN_IDS)).toBeUndefined();
    expect(parseColumnOverrides('', COLUMN_IDS)).toBeUndefined();
  });

  it('reads invalid JSON or a non-object value as no overrides', () => {
    expect(parseColumnOverrides('{not json', COLUMN_IDS)).toBeUndefined();
    expect(parseColumnOverrides('[ "block" ]', COLUMN_IDS)).toBeUndefined();
    expect(parseColumnOverrides('42', COLUMN_IDS)).toBeUndefined();
    expect(parseColumnOverrides('null', COLUMN_IDS)).toBeUndefined();
  });

  it('drops unknown columns and non-boolean states', () => {
    const value = JSON.stringify({ visibility: { block: true, foo: true, amount: 'off', from: false } });

    expect(parseColumnOverrides(value, COLUMN_IDS)).toEqual({ visibility: { block: true, from: false } });
  });

  it('reads the stored order without unknown or repeated columns', () => {
    const value = JSON.stringify({ order: [ 'amount', 'foo', 'hash', 'amount', 42 ] });

    expect(parseColumnOverrides(value, COLUMN_IDS)).toEqual({ order: [ 'amount', 'hash' ] });
  });

  it('keeps a known column unavailable today, so the setting survives where it is available', () => {
    expect(parseColumnOverrides(JSON.stringify({ visibility: { fee: false }, order: [ 'fee' ] }), COLUMN_IDS)).toEqual({
      visibility: { fee: false },
      order: [ 'fee' ],
    });
  });

  it('reads a value with nothing valid left as no overrides', () => {
    expect(parseColumnOverrides(JSON.stringify({ visibility: { foo: true }, order: 'amount' }), COLUMN_IDS)).toBeUndefined();
  });

  it('reads back what was serialised', () => {
    const overrides = { visibility: { block: true, hash: false }, order: [ 'amount' as const, 'hash' as const ] };

    expect(parseColumnOverrides(serializeColumnOverrides(overrides), COLUMN_IDS)).toEqual(overrides);
  });
});

describe('getAvailableColumns', () => {
  it('offers every column but the unavailable ones, in registry order', () => {
    expect(AVAILABLE_COLUMNS.map(({ id }) => id)).toEqual([ 'hash', 'block', 'from', 'amount' ]);
  });
});

describe('getDefaultColumnIds', () => {
  it('shows only the on-by-default columns, in registry order', () => {
    expect(getDefaultColumnIds(COLUMNS, STATES)).toEqual([ 'hash', 'from', 'amount' ]);
  });
});

describe('setColumnVisibility', () => {
  it('records hiding an on-by-default column', () => {
    expect(setColumnVisibility(undefined, STATES, 'hash', false)).toEqual({ visibility: { hash: false } });
  });

  it('records showing an off-by-default column', () => {
    expect(setColumnVisibility(undefined, STATES, 'block', true)).toEqual({ visibility: { block: true } });
  });

  it('drops the entry when a column returns to its default', () => {
    expect(setColumnVisibility({ visibility: { block: true, hash: false } }, STATES, 'block', false)).toEqual({
      visibility: { hash: false },
    });
  });

  it('leaves nothing stored when the last override returns to the default', () => {
    expect(setColumnVisibility({ visibility: { block: true } }, STATES, 'block', false)).toBeUndefined();
  });

  it('keeps the order when the visibility returns to the default', () => {
    expect(setColumnVisibility({ visibility: { block: true }, order: [ 'amount' ] }, STATES, 'block', false)).toEqual({
      order: [ 'amount' ],
    });
  });
});

describe('setColumnOrder', () => {
  it('records the full order of the available columns', () => {
    expect(setColumnOrder(undefined, AVAILABLE_COLUMNS, [ 'amount', 'hash', 'block', 'from' ])).toEqual({
      order: [ 'amount', 'hash', 'block', 'from' ],
    });
  });

  it('completes a partial order with the remaining columns in default order', () => {
    expect(setColumnOrder(undefined, AVAILABLE_COLUMNS, [ 'amount' ])).toEqual({
      order: [ 'amount', 'hash', 'block', 'from' ],
    });
  });

  it('drops the order when it matches the default, keeping the visibility', () => {
    expect(setColumnOrder({ visibility: { hash: false }, order: [ 'amount' ] }, AVAILABLE_COLUMNS, [ 'hash', 'block', 'from', 'amount' ])).toEqual({
      visibility: { hash: false },
    });
  });

  it('leaves nothing stored when the default order is the only override', () => {
    expect(setColumnOrder({ order: [ 'amount' ] }, AVAILABLE_COLUMNS, [])).toBeUndefined();
  });
});

describe('getOrderedColumns', () => {
  it('returns the available columns in default order without a stored order', () => {
    expect(getOrderedIds(undefined)).toEqual([ 'hash', 'block', 'from', 'amount' ]);
  });

  it('follows the stored order', () => {
    expect(getOrderedIds([ 'amount', 'from', 'block', 'hash' ])).toEqual([ 'amount', 'from', 'block', 'hash' ]);
  });

  it('drops stored columns that are unavailable', () => {
    expect(getOrderedIds([ 'fee', 'amount', 'hash', 'block', 'from' ])).toEqual([ 'amount', 'hash', 'block', 'from' ]);
  });

  it('appends the columns missing from the stored order in default order', () => {
    expect(getOrderedIds([ 'amount', 'block' ])).toEqual([ 'amount', 'block', 'hash', 'from' ]);
  });
});

describe('getVisibleColumnIds', () => {
  it('returns the defaults when there are no overrides', () => {
    expect(getVisibleColumnIds(AVAILABLE_COLUMNS, STATES, undefined)).toEqual([ 'hash', 'from', 'amount' ]);
  });

  it('lets columns absent from the overrides follow the current defaults', () => {
    expect(getVisibleColumnIds(AVAILABLE_COLUMNS, STATES, { visibility: { block: true, amount: false } })).toEqual(
      [ 'hash', 'block', 'from' ],
    );
  });

  it('applies the visibility and the order together', () => {
    expect(getVisibleColumnIds(AVAILABLE_COLUMNS, STATES, { visibility: { block: true, hash: false }, order: [ 'amount', 'block' ] })).toEqual(
      [ 'amount', 'block', 'from' ],
    );
  });

  it('never shows an unavailable column', () => {
    expect(getVisibleColumnIds(AVAILABLE_COLUMNS, STATES, { visibility: { fee: true }, order: [ 'fee' ] })).toEqual(
      [ 'hash', 'from', 'amount' ],
    );
  });
});
