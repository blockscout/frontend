// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { highlightsConfig } from '../../mocks/highlights';
import { getValidationErrors } from '../../utils';
import { highlightsConfigSchema } from './highlights';

describe('highlightsConfigSchema', () => {
  it('accepts a config with two banners', () => {
    expect(getValidationErrors(highlightsConfigSchema, {
      NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG: JSON.stringify(highlightsConfig),
    })).toEqual([]);
  });

  it('rejects a config with fewer than two banners', () => {
    expect(getValidationErrors(highlightsConfigSchema, {
      NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG: JSON.stringify([ highlightsConfig[0] ]),
    })).toEqual([ 'NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG: Invalid length: Expected >=2 but received 1' ]);
  });

  it('rejects a banner without a title', () => {
    const { title, ...banner } = highlightsConfig[0];
    expect(getValidationErrors(highlightsConfigSchema, {
      NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG: JSON.stringify([ banner, highlightsConfig[1] ]),
    })).toEqual([ 'NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG.0.title: Invalid key: Expected "title" but received undefined' ]);
  });

  it('rejects a banner with more than two colors', () => {
    expect(getValidationErrors(highlightsConfigSchema, {
      NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG: JSON.stringify([ { ...highlightsConfig[0], background: [ '#fff', '#000', '#ccc' ] }, highlightsConfig[1] ]),
    })).toEqual([ 'NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG.0.background: Invalid length: Expected <=2 but received 3' ]);
  });

  it('rejects a banner with a malformed redirect URL', () => {
    expect(getValidationErrors(highlightsConfigSchema, {
      NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG: JSON.stringify([ highlightsConfig[0], { ...highlightsConfig[1], redirect_url: 'not a url' } ]),
    })).toEqual([ 'NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG.1.redirect_url: Invalid URL: Received "not a url"' ]);
  });

  it('rejects a banner with a non-boolean pinned flag', () => {
    expect(getValidationErrors(highlightsConfigSchema, {
      NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG: JSON.stringify([ highlightsConfig[0], { ...highlightsConfig[1], is_pinned: 'yes' } ]),
    })).toEqual([
      'NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG.1.is_pinned: Invalid type: Expected boolean but received "yes"',
    ]);
  });
});
