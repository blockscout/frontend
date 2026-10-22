// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getValidationErrors } from '../../utils';
import { bubblemapsSchema } from './bubblemaps';

describe('bubblemapsSchema', () => {
  it('accepts the chain slug together with the partner id', () => {
    expect(getValidationErrors(bubblemapsSchema, {
      NEXT_PUBLIC_BUBBLEMAPS_CHAIN_SLUG: 'eth',
      NEXT_PUBLIC_BUBBLEMAPS_PARTNER_ID: 'demo',
    })).toEqual([]);
  });

  it('rejects the chain slug without the partner id', () => {
    expect(getValidationErrors(bubblemapsSchema, { NEXT_PUBLIC_BUBBLEMAPS_CHAIN_SLUG: 'eth' })).toEqual([
      'NEXT_PUBLIC_BUBBLEMAPS_CHAIN_SLUG can only be used with NEXT_PUBLIC_BUBBLEMAPS_PARTNER_ID',
    ]);
  });

  it('rejects the partner id without the chain slug', () => {
    expect(getValidationErrors(bubblemapsSchema, { NEXT_PUBLIC_BUBBLEMAPS_PARTNER_ID: 'demo' })).toEqual([
      'NEXT_PUBLIC_BUBBLEMAPS_PARTNER_ID can only be used with NEXT_PUBLIC_BUBBLEMAPS_CHAIN_SLUG',
    ]);
  });

  it('rejects an empty chain slug', () => {
    expect(getValidationErrors(bubblemapsSchema, {
      NEXT_PUBLIC_BUBBLEMAPS_CHAIN_SLUG: '',
      NEXT_PUBLIC_BUBBLEMAPS_PARTNER_ID: 'demo',
    })).toEqual([
      'NEXT_PUBLIC_BUBBLEMAPS_CHAIN_SLUG: Invalid length: Expected !0 but received 0',
      'NEXT_PUBLIC_BUBBLEMAPS_PARTNER_ID can only be used with NEXT_PUBLIC_BUBBLEMAPS_CHAIN_SLUG',
    ]);
  });

  it('rejects an empty partner id', () => {
    expect(getValidationErrors(bubblemapsSchema, {
      NEXT_PUBLIC_BUBBLEMAPS_CHAIN_SLUG: 'eth',
      NEXT_PUBLIC_BUBBLEMAPS_PARTNER_ID: '',
    })).toEqual([
      'NEXT_PUBLIC_BUBBLEMAPS_PARTNER_ID: Invalid length: Expected !0 but received 0',
      'NEXT_PUBLIC_BUBBLEMAPS_CHAIN_SLUG can only be used with NEXT_PUBLIC_BUBBLEMAPS_PARTNER_ID',
    ]);
  });
});
