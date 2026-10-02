// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getValidationErrors } from '../utils';
import metaSchema from './meta';

describe('metaSchema', () => {
  it('accepts the Open Graph and SEO settings', () => {
    expect(getValidationErrors(metaSchema, {
      NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE: 'true',
      NEXT_PUBLIC_OG_DESCRIPTION: 'Hello world!',
      NEXT_PUBLIC_OG_IMAGE_URL: 'https://example.com/image.png',
      NEXT_PUBLIC_OG_ENHANCED_DATA_ENABLED: 'true',
      NEXT_PUBLIC_SEO_ENHANCED_DATA_ENABLED: 'true',
    })).toEqual([]);
  });

  it('rejects a malformed Open Graph image URL', () => {
    expect(getValidationErrors(metaSchema, { NEXT_PUBLIC_OG_IMAGE_URL: 'not a url' })).toEqual([
      'NEXT_PUBLIC_OG_IMAGE_URL: Invalid URL: Received "not a url"',
    ]);
  });

  it.each([
    'NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE',
    'NEXT_PUBLIC_OG_ENHANCED_DATA_ENABLED',
    'NEXT_PUBLIC_SEO_ENHANCED_DATA_ENABLED',
  ])('rejects a non-boolean %s', (name) => {
    expect(getValidationErrors(metaSchema, { [name]: 'yes' })).toEqual([
      `${ name }: Expected "true" or "false" but received "yes"`,
    ]);
  });
});
