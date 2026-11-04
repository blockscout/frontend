// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { ENTITY_OPTION_KEY_LIST, keysOf, mergeEntityData, mergeIconOptions, resolveEntityOptions, splitByKeys, toTruncationSpec } from './entity-props';

interface Data {
  hash: string;
  text?: string;
}

const DATA_KEYS = keysOf<Data>()([ 'hash', 'text' ]);

describe('splitByKeys', () => {
  it('moves the listed keys into the first half and leaves the rest untouched', () => {
    const [ picked, rest ] = splitByKeys<Data, { isLoading: boolean }>({ hash: '0x1', text: 'one', isLoading: true }, DATA_KEYS);

    expect(picked).toEqual({ hash: '0x1', text: 'one' });
    expect(rest).toEqual({ isLoading: true });
  });

  it('reports no override when none of the listed keys is present', () => {
    const [ picked, rest ] = splitByKeys<Data, { isLoading: boolean }>({ isLoading: true }, DATA_KEYS);

    expect(picked).toBeUndefined();
    expect(rest).toEqual({ isLoading: true });
  });

  it('treats a key set to undefined as absent, and still removes it from the rest', () => {
    const [ picked, rest ] = splitByKeys<Data, object>({ hash: undefined, text: 'one' }, DATA_KEYS);

    expect(picked).toEqual({ text: 'one' });
    expect(rest).toEqual({});
  });

  it('reports no override when every listed key is undefined', () => {
    const [ picked ] = splitByKeys<Data, object>({ hash: undefined }, DATA_KEYS);

    expect(picked).toBeUndefined();
  });

  it('does not mutate the input', () => {
    const props = { hash: '0x1', isLoading: true };
    splitByKeys<Data, object>(props, DATA_KEYS);

    expect(props).toEqual({ hash: '0x1', isLoading: true });
  });
});

describe('resolveEntityOptions', () => {
  it('starts from the defaults', () => {
    expect(resolveEntityOptions({ truncation: 'tail', noCopy: true }, {})).toEqual({ truncation: 'tail', noCopy: true });
  });

  it('lets a defined caller value win over the default', () => {
    expect(resolveEntityOptions({ truncation: 'tail', noCopy: true }, { truncation: 'constant', noCopy: false }))
      .toEqual({ truncation: 'constant', noCopy: false });
  });

  it('keeps the default when the caller value is undefined', () => {
    expect(resolveEntityOptions({ truncation: 'tail' }, { truncation: undefined, isLoading: true })).toEqual({ truncation: 'tail', isLoading: true });
  });

  it('works without defaults', () => {
    expect(resolveEntityOptions(undefined, { noLink: true })).toEqual({ noLink: true });
  });

  it('merges the icon defaults under the caller icon bag', () => {
    expect(resolveEntityOptions({ icon: { borderRadius: 'none' } }, { icon: { name: 'blob' } }))
      .toEqual({ icon: { borderRadius: 'none', name: 'blob' } });
    expect(resolveEntityOptions({ icon: { borderRadius: 'none' } }, { icon: { borderRadius: 'md' } }))
      .toEqual({ icon: { borderRadius: 'md' } });
  });

  it('keeps the icon defaults when the caller passes no icon bag', () => {
    expect(resolveEntityOptions({ icon: { borderRadius: 'none' } }, { isLoading: true })).toEqual({ icon: { borderRadius: 'none' }, isLoading: true });
  });
});

describe('mergeEntityData', () => {
  it('lets the override win over the root data field by field', () => {
    expect(mergeEntityData<Data>({ hash: '0x1', text: 'one' }, { text: 'two' })).toEqual({ hash: '0x1', text: 'two' });
  });

  it('returns the override alone when there is no root', () => {
    expect(mergeEntityData<Data>(undefined, { hash: '0x2' })).toEqual({ hash: '0x2' });
  });

  it('returns the root data alone when there is no override', () => {
    expect(mergeEntityData<Data>({ hash: '0x1' }, undefined)).toEqual({ hash: '0x1' });
  });
});

describe('mergeIconOptions', () => {
  it('lets the part props win over the root icon bag', () => {
    expect(mergeIconOptions({ name: 'block', hint: 'root' }, { hint: 'own' })).toEqual({ name: 'block', hint: 'own' });
  });

  it('works without a root icon bag', () => {
    expect(mergeIconOptions(undefined, { hint: 'own' })).toEqual({ hint: 'own' });
  });
});

describe('ENTITY_OPTION_KEY_LIST', () => {
  it('lists every public option once', () => {
    expect([ ...ENTITY_OPTION_KEY_LIST ].sort()).toEqual([
      'chain', 'href', 'icon', 'isLoading', 'link', 'noCopy', 'noIcon', 'noLink', 'noTooltip',
      'onClick', 'query', 'truncation', 'variant',
    ]);
  });
});

describe('toTruncationSpec', () => {
  it('reads a shorthand string as a type with no tail length or symbol count', () => {
    expect(toTruncationSpec('tail')).toEqual({ type: 'tail' });
  });

  it('keeps the tail length of the dynamic form', () => {
    expect(toTruncationSpec({ type: 'dynamic', tailLength: 2 })).toEqual({ type: 'dynamic', tailLength: 2 });
  });

  it('keeps the symbol count of the constant form', () => {
    expect(toTruncationSpec({ type: 'constant', maxSymbols: 6 })).toEqual({ type: 'constant', maxSymbols: 6 });
  });
});
