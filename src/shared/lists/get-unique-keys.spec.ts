// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getUniqueKeys } from './get-unique-keys';

const byId = (item: { id: string }) => item.id;

describe('getUniqueKeys', () => {
  it('returns the base key when all items are distinct', () => {
    expect(getUniqueKeys([ { id: 'a' }, { id: 'b' } ], byId)).toEqual([ 'a', 'b' ]);
  });

  it('returns an empty list when there are no items yet', () => {
    expect(getUniqueKeys(undefined, byId)).toEqual([]);
  });

  it('appends an occurrence ordinal to every repeat of a base key', () => {
    expect(getUniqueKeys([ { id: 'a' }, { id: 'a' }, { id: 'b' }, { id: 'a' } ], byId)).toEqual([ 'a', 'a_1', 'b', 'a_2' ]);
  });

  it('keeps the keys of existing items when a new item is prepended', () => {
    const page = [ { id: 'a' }, { id: 'a' }, { id: 'b' } ];
    const before = getUniqueKeys(page, byId);
    const after = getUniqueKeys([ { id: 'c' }, ...page ], byId);

    expect(after.slice(1)).toEqual(before);
  });

  it('assigns the prepended item the first ordinal of its group', () => {
    const page = [ { id: 'a' }, { id: 'b' } ];

    expect(getUniqueKeys([ { id: 'a' }, ...page ], byId)).toEqual([ 'a', 'a_1', 'b' ]);
  });

  it('yields keys that are all distinct', () => {
    const keys = getUniqueKeys([ { id: 'a' }, { id: 'a' }, { id: 'a' }, { id: 'b' }, { id: 'b' } ], byId);

    expect(new Set(keys).size).toBe(keys.length);
  });
});
