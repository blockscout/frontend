// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getVisibleColumnIds, parseColumnOverrides, serializeColumnOverrides, setColumnVisibility } from './column-overrides';

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
    expect(parseColumnOverrides('{%22index%22:{%22block%22:false%2C%22asset%22:false}}')).toEqual({
      index: { block: false, asset: false },
    });
  });

  it('drops unknown surfaces, unknown columns and non-boolean states', () => {
    const cookie = JSON.stringify({
      index: { block: false, foo: true, asset: 'off' },
      token: 'block',
      unknown: { block: true },
      tx: { asset: 1 },
    });

    expect(parseColumnOverrides(cookie)).toEqual({ index: { block: false } });
  });

  it('reads back what was serialised', () => {
    const overridesMap = { index: { block: false }, token: { type: true, timestamp: false } };

    expect(parseColumnOverrides(serializeColumnOverrides(overridesMap))).toEqual(overridesMap);
  });
});

describe('setColumnVisibility', () => {
  it('records hiding an on-by-default column', () => {
    expect(setColumnVisibility({}, 'index', 'block', false)).toEqual({ index: { block: false } });
  });

  it('records showing an off-by-default column', () => {
    expect(setColumnVisibility({}, 'token', 'block', true)).toEqual({ token: { block: true } });
  });

  it('drops the entry when a column returns to its default', () => {
    expect(setColumnVisibility({ index: { block: false, asset: false } }, 'index', 'block', true)).toEqual({
      index: { asset: false },
    });
  });

  it('drops the surface when its last override returns to the default', () => {
    expect(setColumnVisibility({ index: { block: false }, token: { block: true } }, 'index', 'block', true)).toEqual({
      token: { block: true },
    });
  });

  it('keeps the other surfaces untouched', () => {
    expect(setColumnVisibility({ token: { block: true } }, 'address', 'value', false)).toEqual({
      token: { block: true },
      address: { value: false },
    });
  });
});

describe('getVisibleColumnIds', () => {
  it('returns the surface defaults when there are no overrides', () => {
    expect(getVisibleColumnIds('token', undefined)).toEqual(
      [ 'tx_hash', 'method', 'timestamp', 'from_to', 'token_id', 'amount', 'value' ],
    );
  });

  it('applies the overrides in vocabulary order', () => {
    expect(getVisibleColumnIds('token', { block: true, type: true, value: false })).toEqual(
      [ 'tx_hash', 'type', 'method', 'timestamp', 'block', 'from_to', 'token_id', 'amount' ],
    );
  });

  it('lets columns absent from the overrides follow the current surface defaults', () => {
    expect(getVisibleColumnIds('index', { block: false })).toEqual(
      [ 'tx_hash', 'type', 'transfer_type', 'method', 'timestamp', 'from_to', 'token_id', 'amount', 'asset', 'value' ],
    );
  });

  it('never shows a column unavailable on the surface', () => {
    expect(getVisibleColumnIds('tx', { tx_hash: true, block: true })).toEqual(
      [ 'type', 'transfer_type', 'from_to', 'token_id', 'amount', 'asset', 'value' ],
    );
  });
});
