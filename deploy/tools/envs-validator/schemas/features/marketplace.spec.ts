// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { essentialDappsConfig, marketplaceApps, marketplaceCategories, marketplaceTitles } from '../../mocks/marketplace';
import { toEnvValue } from '../../test-utils';
import { getValidationErrors } from '../../utils';
import { marketplaceSchema } from './marketplace';

const ENABLED = { NEXT_PUBLIC_MARKETPLACE_ENABLED: 'true', NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM: 'https://example.com' };

const dependents: Array<[ string, string ]> = [
  [ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', JSON.stringify(marketplaceApps) ],
  [ 'NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL', JSON.stringify(marketplaceCategories) ],
  [ 'NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM', 'https://example.com' ],
  [ 'NEXT_PUBLIC_MARKETPLACE_SUGGEST_IDEAS_FORM', 'https://example.com' ],
  [ 'NEXT_PUBLIC_MARKETPLACE_FEATURED_APP', 'aave' ],
  [ 'NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL', 'https://example.com/banner.html' ],
  [ 'NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL', 'https://www.basename.app' ],
  [ 'NEXT_PUBLIC_MARKETPLACE_GRAPH_LINKS_URL', 'https://example.com' ],
  [ 'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG', toEnvValue(essentialDappsConfig) ],
  [ 'NEXT_PUBLIC_MARKETPLACE_TITLES', toEnvValue(marketplaceTitles) ],
  [ 'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_AD_ENABLED', 'true' ],
];

describe('marketplaceSchema', () => {
  it('accepts the full marketplace setup', () => {
    expect(getValidationErrors(marketplaceSchema, { ...ENABLED, ...Object.fromEntries(dependents) })).toEqual([]);
  });

  it('accepts an empty config', () => {
    expect(getValidationErrors(marketplaceSchema, {})).toEqual([]);
  });

  it('requires the submit form when the marketplace is enabled', () => {
    expect(getValidationErrors(marketplaceSchema, { NEXT_PUBLIC_MARKETPLACE_ENABLED: 'true' })).toEqual([
      'NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM is required when NEXT_PUBLIC_MARKETPLACE_ENABLED is set',
    ]);
  });

  it('rejects a non-boolean enabled flag', () => {
    expect(getValidationErrors(marketplaceSchema, { NEXT_PUBLIC_MARKETPLACE_ENABLED: 'yes' })).toEqual([
      'NEXT_PUBLIC_MARKETPLACE_ENABLED: Expected "true" or "false" but received "yes"',
    ]);
  });

  describe.each(dependents)('%s', (name, value) => {
    it('is accepted when the marketplace is enabled', () => {
      expect(getValidationErrors(marketplaceSchema, { ...ENABLED, [name]: value })).toEqual([]);
    });

    it('is rejected when the marketplace is not enabled', () => {
      expect(getValidationErrors(marketplaceSchema, { [name]: value })).toEqual([
        `${ name } cannot not be used without NEXT_PUBLIC_MARKETPLACE_ENABLED`,
      ]);
    });
  });

  it.each([
    'NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM',
    'NEXT_PUBLIC_MARKETPLACE_SUGGEST_IDEAS_FORM',
    'NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL',
    'NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL',
  ])('rejects a malformed %s', (name) => {
    expect(getValidationErrors(marketplaceSchema, { ...ENABLED, [name]: 'not a url' })).toEqual([ `${ name }: Invalid URL: Received "not a url"` ]);
  });

  describe('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', () => {
    it('accepts an app with a single github link', () => {
      expect(getValidationErrors(marketplaceSchema, {
        ...ENABLED,
        NEXT_PUBLIC_MARKETPLACE_CONFIG_URL: JSON.stringify([ { ...marketplaceApps[0], github: 'https://github.com/a' } ]),
      })).toEqual([]);
    });

    it('rejects an app without an id', () => {
      const { id, ...app } = marketplaceApps[0];
      expect(getValidationErrors(marketplaceSchema, {
        ...ENABLED,
        NEXT_PUBLIC_MARKETPLACE_CONFIG_URL: JSON.stringify([ app ]),
      })).toEqual([ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL.0.id: Invalid key: Expected "id" but received undefined' ]);
    });

    it('rejects an app with a malformed logo URL', () => {
      expect(getValidationErrors(marketplaceSchema, {
        ...ENABLED,
        NEXT_PUBLIC_MARKETPLACE_CONFIG_URL: JSON.stringify([ { ...marketplaceApps[0], logo: 'not a url' } ]),
      })).toEqual([ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL.0.logo: Invalid URL: Received "not a url"' ]);
    });

    it('rejects an app with a malformed github link in the list', () => {
      expect(getValidationErrors(marketplaceSchema, {
        ...ENABLED,
        NEXT_PUBLIC_MARKETPLACE_CONFIG_URL: JSON.stringify([ { ...marketplaceApps[0], github: [ 'not a url' ] } ]),
      })).toEqual([ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL.0.github.0: Invalid URL: Received "not a url"' ]);
    });

    it('rejects an app with a non-boolean external flag', () => {
      expect(getValidationErrors(marketplaceSchema, {
        ...ENABLED,
        NEXT_PUBLIC_MARKETPLACE_CONFIG_URL: JSON.stringify([ { ...marketplaceApps[0], external: 'yes' } ]),
      })).toEqual([ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL.0.external: Invalid type: Expected boolean but received "yes"' ]);
    });

    it('rejects an app with a non-numeric priority', () => {
      expect(getValidationErrors(marketplaceSchema, {
        ...ENABLED,
        NEXT_PUBLIC_MARKETPLACE_CONFIG_URL: JSON.stringify([ { ...marketplaceApps[0], priority: 'high' } ]),
      })).toEqual([ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL.0.priority: Invalid type: Expected number but received "high"' ]);
    });
  });

  describe('NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG', () => {
    it('accepts a single section', () => {
      expect(getValidationErrors(marketplaceSchema, {
        ...ENABLED,
        NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG: toEnvValue({ revoke: essentialDappsConfig.revoke }),
      })).toEqual([]);
    });

    it('rejects a swap section without the integrator', () => {
      expect(getValidationErrors(marketplaceSchema, {
        ...ENABLED,
        NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG: toEnvValue({ swap: { chains: [ '1' ], fee: '0.004' } }),
      })).toEqual([ 'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG.swap.integrator: Invalid key: Expected "integrator" but received undefined' ]);
    });

    it('rejects a section with an empty chain list', () => {
      expect(getValidationErrors(marketplaceSchema, {
        ...ENABLED,
        NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG: toEnvValue({ revoke: { chains: [] } }),
      })).toEqual([ 'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG.revoke.chains: Invalid length: Expected >=1 but received 0' ]);
    });

    it('rejects a multisend section with a malformed posthog host', () => {
      expect(getValidationErrors(marketplaceSchema, {
        ...ENABLED,
        NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG: toEnvValue({ multisend: { chains: [ '1' ], posthogHost: 'not a url' } }),
      })).toEqual([ 'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG.multisend.posthogHost: Invalid URL: Received "not a url"' ]);
    });
  });

  describe('NEXT_PUBLIC_MARKETPLACE_TITLES', () => {
    it('rejects a non-string title', () => {
      expect(getValidationErrors(marketplaceSchema, {
        ...ENABLED,
        NEXT_PUBLIC_MARKETPLACE_TITLES: toEnvValue({ title: [ 'Dappscout' ] }),
      })).toEqual([ 'NEXT_PUBLIC_MARKETPLACE_TITLES.title: Invalid type: Expected string but received Array' ]);
    });
  });

  it('rejects a non-boolean essential dapps ad flag', () => {
    expect(getValidationErrors(marketplaceSchema, { ...ENABLED, NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_AD_ENABLED: 'yes' })).toEqual([
      'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_AD_ENABLED: Expected "true" or "false" but received "yes"',
    ]);
  });
});
