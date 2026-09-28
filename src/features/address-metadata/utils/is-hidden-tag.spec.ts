// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { isHiddenTag } from './is-hidden-tag';

describe('isHiddenTag', () => {
  it('is true only for the exact string "true"', () => {
    expect(isHiddenTag({ meta: { hidden: 'true' } })).toBe(true);
    expect(isHiddenTag({ meta: { hidden: 'false' } })).toBe(false);
    expect(isHiddenTag({ meta: { hidden: true } })).toBe(false);
    expect(isHiddenTag({ meta: { hidden: 'TRUE' } })).toBe(false);
  });

  it('is false when meta is absent, null or lacks the field', () => {
    expect(isHiddenTag({})).toBe(false);
    expect(isHiddenTag({ meta: null })).toBe(false);
    expect(isHiddenTag({ meta: {} })).toBe(false);
  });
});
