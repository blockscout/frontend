// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import {
  getOrderedColumns,
  getVisibleColumnIds,
  parseColumnOverrides,
  serializeColumnOverrides,
  setColumnOrder,
  setColumnVisibility,
} from './column-overrides';

const getOrderedIds = (...args: Parameters<typeof getOrderedColumns>) => getOrderedColumns(...args).map(({ id }) => id);

describe('parseColumnOverrides', () => {
  it('returns an empty map when there is no cookie', () => {
    expect(parseColumnOverrides(undefined)).toEqual({});
    expect(parseColumnOverrides('')).toEqual({});
  });

  it('returns an empty map for a malformed or non-object value', () => {
    expect(parseColumnOverrides('{not json')).toEqual({});
    expect(parseColumnOverrides('[ "block" ]')).toEqual({});
    expect(parseColumnOverrides('%E0%A4%A')).toEqual({});
  });

  it('reads the percent-encoded value of a raw cookie header', () => {
    expect(parseColumnOverrides('{%22index%22:{%22visibility%22:{%22block%22:false%2C%22asset%22:false}}}')).toEqual({
      index: { visibility: { block: false, asset: false } },
    });
  });

  it('drops unknown surfaces, unknown columns and non-boolean states', () => {
    const cookie = JSON.stringify({
      index: { visibility: { block: false, foo: true, asset: 'off' } },
      token: 'block',
      unknown: { visibility: { block: true } },
      tx: { visibility: { asset: 1 } },
    });

    expect(parseColumnOverrides(cookie)).toEqual({ index: { visibility: { block: false } } });
  });

  it('reads the stored order without unknown or repeated columns', () => {
    const cookie = JSON.stringify({
      index: { order: [ 'value', 'foo', 'tx_hash', 'value', 42 ] },
      token: { order: 'value' },
      tx: { order: [ 'foo' ] },
    });

    expect(parseColumnOverrides(cookie)).toEqual({ index: { order: [ 'value', 'tx_hash' ] } });
  });

  it('reads the previous flat shape as no overrides', () => {
    expect(parseColumnOverrides(JSON.stringify({ index: { block: false }, token: { type: true } }))).toEqual({});
  });

  it('ignores the stale token_id column', () => {
    expect(parseColumnOverrides(JSON.stringify({ index: { visibility: { token_id: false, block: false } } }))).toEqual({
      index: { visibility: { block: false } },
    });
  });

  it('reads back what was serialised', () => {
    const overridesMap = {
      index: { visibility: { block: false } },
      token: { visibility: { type: true, timestamp: false }, order: [ 'value' as const, 'tx_hash' as const ] },
      tx: { order: [ 'amount' as const ] },
    };

    expect(parseColumnOverrides(serializeColumnOverrides(overridesMap))).toEqual(overridesMap);
  });
});

describe('setColumnVisibility', () => {
  it('records hiding an on-by-default column', () => {
    expect(setColumnVisibility({}, 'index', 'block', false)).toEqual({ index: { visibility: { block: false } } });
  });

  it('records showing an off-by-default column', () => {
    expect(setColumnVisibility({}, 'token', 'block', true)).toEqual({ token: { visibility: { block: true } } });
  });

  it('drops the entry when a column returns to its default', () => {
    expect(setColumnVisibility({ index: { visibility: { block: false, asset: false } } }, 'index', 'block', true)).toEqual({
      index: { visibility: { asset: false } },
    });
  });

  it('drops the surface when its last override returns to the default', () => {
    expect(setColumnVisibility({ index: { visibility: { block: false } }, token: { visibility: { block: true } } }, 'index', 'block', true)).toEqual({
      token: { visibility: { block: true } },
    });
  });

  it('keeps the surface order when the visibility returns to the default', () => {
    expect(setColumnVisibility({ index: { visibility: { block: false }, order: [ 'value' ] } }, 'index', 'block', true)).toEqual({
      index: { order: [ 'value' ] },
    });
  });

  it('keeps the other surfaces untouched', () => {
    expect(setColumnVisibility({ token: { visibility: { block: true } } }, 'address', 'value', false)).toEqual({
      token: { visibility: { block: true } },
      address: { visibility: { value: false } },
    });
  });
});

describe('setColumnOrder', () => {
  it('records the full order of the surface columns', () => {
    expect(setColumnOrder({}, 'tx', [ 'value', 'type', 'transfer_type', 'from_to', 'amount', 'asset' ])).toEqual({
      tx: { order: [ 'value', 'type', 'transfer_type', 'from_to', 'amount', 'asset' ] },
    });
  });

  it('completes a partial order with the remaining columns in default order', () => {
    expect(setColumnOrder({}, 'tx', [ 'value' ])).toEqual({
      tx: { order: [ 'value', 'type', 'transfer_type', 'from_to', 'amount', 'asset' ] },
    });
  });

  it('drops the order when it matches the default, keeping the visibility', () => {
    const overridesMap = { tx: { visibility: { value: false }, order: [ 'value' as const ] } };

    expect(setColumnOrder(overridesMap, 'tx', [ 'type', 'transfer_type', 'from_to', 'amount', 'asset', 'value' ])).toEqual({
      tx: { visibility: { value: false } },
    });
  });

  it('drops the surface when the default order leaves nothing stored', () => {
    expect(setColumnOrder({ tx: { order: [ 'value' ] }, token: { order: [ 'value' ] } }, 'tx', [])).toEqual({
      token: { order: [ 'value' ] },
    });
  });
});

describe('getOrderedColumns', () => {
  it('returns the surface columns in default order without a stored order', () => {
    expect(getOrderedIds('tx', undefined)).toEqual([ 'type', 'transfer_type', 'from_to', 'amount', 'asset', 'value' ]);
  });

  it('follows the stored order', () => {
    expect(getOrderedIds('tx', [ 'value', 'asset', 'amount', 'from_to', 'transfer_type', 'type' ])).toEqual(
      [ 'value', 'asset', 'amount', 'from_to', 'transfer_type', 'type' ],
    );
  });

  it('drops stored columns unavailable on the surface', () => {
    expect(getOrderedIds('tx', [ 'block', 'value', 'tx_hash', 'type', 'transfer_type', 'from_to', 'amount', 'asset' ])).toEqual(
      [ 'value', 'type', 'transfer_type', 'from_to', 'amount', 'asset' ],
    );
  });

  it('appends the columns missing from the stored order in default order', () => {
    expect(getOrderedIds('tx', [ 'asset', 'type' ])).toEqual([ 'asset', 'type', 'transfer_type', 'from_to', 'amount', 'value' ]);
  });
});

describe('getVisibleColumnIds', () => {
  it('returns the surface defaults when there are no overrides', () => {
    expect(getVisibleColumnIds('token', undefined)).toEqual(
      [ 'tx_hash', 'method', 'timestamp', 'from_to', 'amount', 'asset', 'value' ],
    );
  });

  it('applies the visibility overrides in vocabulary order', () => {
    expect(getVisibleColumnIds('token', { visibility: { block: true, type: true, value: false } })).toEqual(
      [ 'tx_hash', 'type', 'method', 'timestamp', 'block', 'from_to', 'amount', 'asset' ],
    );
  });

  it('lets columns absent from the overrides follow the current surface defaults', () => {
    expect(getVisibleColumnIds('index', { visibility: { block: false } })).toEqual(
      [ 'tx_hash', 'type', 'transfer_type', 'method', 'timestamp', 'from_to', 'amount', 'asset', 'value' ],
    );
  });

  it('applies the stored order to the visible columns', () => {
    expect(getVisibleColumnIds('token', { order: [ 'value', 'block', 'tx_hash' ] })).toEqual(
      [ 'value', 'tx_hash', 'method', 'timestamp', 'from_to', 'amount', 'asset' ],
    );
  });

  it('applies the visibility and the order together', () => {
    expect(getVisibleColumnIds('token', { visibility: { block: true, tx_hash: false }, order: [ 'value', 'block', 'tx_hash' ] })).toEqual(
      [ 'value', 'block', 'method', 'timestamp', 'from_to', 'amount', 'asset' ],
    );
  });

  it('never shows a column unavailable on the surface', () => {
    expect(getVisibleColumnIds('tx', { visibility: { tx_hash: true, block: true } })).toEqual(
      [ 'type', 'transfer_type', 'from_to', 'amount', 'asset', 'value' ],
    );
  });
});
