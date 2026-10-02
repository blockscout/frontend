// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import {
  contractCodeIdes,
  featuredNetworks,
  fontFamilyBody,
  fontFamilyHeading,
  footerLinks,
  heroBannerConfig,
  networkExplorers,
  nftMarketplaces,
  promoBannerConfigFull,
  promoBannerConfigImageOnly,
} from '../mocks/ui';
import { toEnvValue } from '../test-utils';
import { getValidationErrors } from '../utils';
import { footerSchema, homepageSchema, miscSchema, navigationSchema, viewsSchema } from './ui';

const nonBooleanMessage = (name: string) => `${ name }: Expected "true" or "false" but received "yes"`;
const picklistMessage = (name: string, allowed: Array<string>, received: string) =>
  `${ name }: Invalid type: Expected (${ allowed.map((item) => `"${ item }"`).join(' | ') }) but received "${ received }"`;

describe('homepageSchema', () => {
  it('accepts the charts, stats and hero banner settings', () => {
    expect(getValidationErrors(homepageSchema, {
      NEXT_PUBLIC_HOMEPAGE_CHARTS: toEnvValue([ 'daily_txs' ]),
      NEXT_PUBLIC_HOMEPAGE_STATS: toEnvValue([ 'total_blocks', 'average_block_time', 'total_txs', 'wallet_addresses', 'gas_tracker', 'current_epoch' ]),
      NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG: toEnvValue(heroBannerConfig),
    })).toEqual([]);
  });

  it('accepts an empty stats list', () => {
    expect(getValidationErrors(homepageSchema, { NEXT_PUBLIC_HOMEPAGE_STATS: toEnvValue([]) })).toEqual([]);
  });

  it('rejects an unknown chart id', () => {
    expect(getValidationErrors(homepageSchema, { NEXT_PUBLIC_HOMEPAGE_CHARTS: toEnvValue([ 'weekly_txs' ]) })).toEqual([
      picklistMessage(
        'NEXT_PUBLIC_HOMEPAGE_CHARTS.0',
        [ 'daily_txs', 'daily_operational_txs', 'coin_price', 'secondary_coin_price', 'market_cap', 'tvl' ],
        'weekly_txs',
      ),
    ]);
  });

  it('rejects an unknown stats widget id', () => {
    expect(getValidationErrors(homepageSchema, { NEXT_PUBLIC_HOMEPAGE_STATS: toEnvValue([ 'unknown' ]) })).toEqual([
      picklistMessage('NEXT_PUBLIC_HOMEPAGE_STATS.0', [
        'latest_batch', 'total_blocks', 'average_block_time', 'total_txs', 'total_operational_txs',
        'latest_l1_state_batch', 'wallet_addresses', 'gas_tracker', 'btc_locked', 'current_epoch',
      ], 'unknown'),
    ]);
  });

  describe('stats-service-only ids', () => {
    it('accepts daily_operational_txs together with the stats API host', () => {
      expect(getValidationErrors(homepageSchema, {
        NEXT_PUBLIC_STATS_API_HOST: 'https://stats.example.com',
        NEXT_PUBLIC_HOMEPAGE_CHARTS: toEnvValue([ 'daily_operational_txs' ]),
      })).toEqual([]);
    });

    it('rejects daily_operational_txs without the stats API host', () => {
      expect(getValidationErrors(homepageSchema, { NEXT_PUBLIC_HOMEPAGE_CHARTS: toEnvValue([ 'daily_operational_txs' ]) })).toEqual([
        'NEXT_PUBLIC_STATS_API_HOST is required when daily_operational_txs is enabled in NEXT_PUBLIC_HOMEPAGE_CHARTS',
      ]);
    });

    it('accepts total_operational_txs together with the stats API host', () => {
      expect(getValidationErrors(homepageSchema, {
        NEXT_PUBLIC_STATS_API_HOST: 'https://stats.example.com',
        NEXT_PUBLIC_HOMEPAGE_STATS: toEnvValue([ 'total_operational_txs' ]),
      })).toEqual([]);
    });

    it('rejects total_operational_txs without the stats API host', () => {
      expect(getValidationErrors(homepageSchema, { NEXT_PUBLIC_HOMEPAGE_STATS: toEnvValue([ 'total_operational_txs' ]) })).toEqual([
        'NEXT_PUBLIC_STATS_API_HOST is required when total_operational_txs is enabled in NEXT_PUBLIC_HOMEPAGE_STATS',
      ]);
    });
  });

  describe('hero banner config', () => {
    it('rejects a color list with more than two entries', () => {
      expect(getValidationErrors(homepageSchema, {
        NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG: toEnvValue({ background: [ 'red', 'green', 'blue' ] }),
      })).toEqual([
        'NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG.background: Invalid length: Expected <=2 but received 3',
      ]);
    });

    it('rejects a value that is not a JSON object', () => {
      expect(getValidationErrors(homepageSchema, { NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG: 'lightpink' })).toEqual([
        'NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG: Invalid JSON: Received "lightpink"',
      ]);
    });
  });
});

describe('navigationSchema', () => {
  const FEATURED = { NEXT_PUBLIC_FEATURED_NETWORKS: JSON.stringify(featuredNetworks) };

  it('accepts the navigation, featured networks and logo settings', () => {
    expect(getValidationErrors(navigationSchema, {
      ...FEATURED,
      NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK: 'https://example.com',
      NEXT_PUBLIC_FEATURED_NETWORKS_MODE: 'list',
      NEXT_PUBLIC_OTHER_LINKS: toEnvValue([ { url: 'https://blockscout.com', text: 'Blockscout' } ]),
      NEXT_PUBLIC_NAVIGATION_HIGHLIGHTED_ROUTES: toEnvValue([ '/accounts', '/apps' ]),
      NEXT_PUBLIC_NAVIGATION_LAYOUT: 'horizontal',
      NEXT_PUBLIC_NAVIGATION_PROMO_BANNER_CONFIG: toEnvValue(promoBannerConfigFull),
      NEXT_PUBLIC_NETWORK_LOGO: 'https://example.com/logo.png',
      NEXT_PUBLIC_NETWORK_LOGO_DARK: 'https://example.com/logo-dark.png',
      NEXT_PUBLIC_NETWORK_ICON: 'https://example.com/icon.png',
      NEXT_PUBLIC_NETWORK_ICON_DARK: 'https://example.com/icon-dark.png',
    })).toEqual([]);
  });

  it('rejects an unsupported layout', () => {
    expect(getValidationErrors(navigationSchema, { NEXT_PUBLIC_NAVIGATION_LAYOUT: 'diagonal' })).toEqual([
      picklistMessage('NEXT_PUBLIC_NAVIGATION_LAYOUT', [ 'horizontal', 'vertical' ], 'diagonal'),
    ]);
  });

  it.each([
    'NEXT_PUBLIC_NETWORK_LOGO',
    'NEXT_PUBLIC_NETWORK_LOGO_DARK',
    'NEXT_PUBLIC_NETWORK_ICON',
    'NEXT_PUBLIC_NETWORK_ICON_DARK',
  ])('rejects a malformed %s', (name) => {
    expect(getValidationErrors(navigationSchema, { [name]: 'not a url' })).toEqual([ `${ name }: Invalid URL: Received "not a url"` ]);
  });

  describe('featured networks', () => {
    it('rejects a network with an unknown group', () => {
      expect(getValidationErrors(navigationSchema, {
        NEXT_PUBLIC_FEATURED_NETWORKS: JSON.stringify([ { ...featuredNetworks[0], group: 'Devnets' } ]),
      })).toEqual([ picklistMessage('NEXT_PUBLIC_FEATURED_NETWORKS.0.group', [ 'Mainnets', 'Testnets', 'Other' ], 'Devnets') ]);
    });

    it('rejects a network with a malformed URL', () => {
      expect(getValidationErrors(navigationSchema, {
        NEXT_PUBLIC_FEATURED_NETWORKS: JSON.stringify([ { ...featuredNetworks[0], url: 'not a url' } ]),
      })).toEqual([ 'NEXT_PUBLIC_FEATURED_NETWORKS.0.url: Invalid URL: Received "not a url"' ]);
    });

    it('rejects a network with an empty icon URL', () => {
      expect(getValidationErrors(navigationSchema, {
        NEXT_PUBLIC_FEATURED_NETWORKS: JSON.stringify([ { ...featuredNetworks[0], icon: '' } ]),
      })).toEqual([ 'NEXT_PUBLIC_FEATURED_NETWORKS.0.icon: Invalid URL: Received ""' ]);
    });

    it('rejects the all-networks link when the featured networks list is empty', () => {
      expect(getValidationErrors(navigationSchema, {
        NEXT_PUBLIC_FEATURED_NETWORKS: JSON.stringify([]),
        NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK: 'https://example.com',
      })).toEqual([ 'NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK can only be set when NEXT_PUBLIC_FEATURED_NETWORKS is configured' ]);
    });

    it('rejects a malformed all-networks link', () => {
      expect(getValidationErrors(navigationSchema, { ...FEATURED, NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK: 'not a url' })).toEqual([
        'NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK: Invalid URL: Received "not a url"',
      ]);
    });

    it('rejects an unsupported mode', () => {
      expect(getValidationErrors(navigationSchema, { ...FEATURED, NEXT_PUBLIC_FEATURED_NETWORKS_MODE: 'grid' })).toEqual([
        picklistMessage('NEXT_PUBLIC_FEATURED_NETWORKS_MODE', [ 'tabs', 'list' ], 'grid'),
      ]);
    });

    it('rejects the all-networks link without the networks', () => {
      expect(getValidationErrors(navigationSchema, { NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK: 'https://example.com' })).toEqual([
        'NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK can only be set when NEXT_PUBLIC_FEATURED_NETWORKS is configured',
      ]);
    });

    it('rejects the mode without the networks', () => {
      expect(getValidationErrors(navigationSchema, { NEXT_PUBLIC_FEATURED_NETWORKS_MODE: 'list' })).toEqual([
        'NEXT_PUBLIC_FEATURED_NETWORKS_MODE can only be set when NEXT_PUBLIC_FEATURED_NETWORKS is configured',
      ]);
    });
  });

  it('rejects an other link with a malformed URL', () => {
    expect(getValidationErrors(navigationSchema, {
      NEXT_PUBLIC_OTHER_LINKS: toEnvValue([ { url: 'not a url', text: 'Blockscout' } ]),
    })).toEqual([ 'NEXT_PUBLIC_OTHER_LINKS.0.url: Invalid URL: Received "not a url"' ]);
  });

  describe('promo banner config', () => {
    it('accepts the image-only variant', () => {
      expect(getValidationErrors(navigationSchema, {
        NEXT_PUBLIC_NAVIGATION_PROMO_BANNER_CONFIG: toEnvValue(promoBannerConfigImageOnly),
      })).toEqual([]);
    });

    it('rejects a config without the link URL', () => {
      expect(getValidationErrors(navigationSchema, {
        NEXT_PUBLIC_NAVIGATION_PROMO_BANNER_CONFIG: toEnvValue({ img_url: 'https://example.com/promo.svg', text: 'Promo text' }),
      })).toEqual([
        'NEXT_PUBLIC_NAVIGATION_PROMO_BANNER_CONFIG.bg_color: Invalid key: Expected "bg_color" but received undefined',
        'NEXT_PUBLIC_NAVIGATION_PROMO_BANNER_CONFIG.text_color: Invalid key: Expected "text_color" but received undefined',
        'NEXT_PUBLIC_NAVIGATION_PROMO_BANNER_CONFIG.link_url: Invalid key: Expected "link_url" but received undefined',
        'NEXT_PUBLIC_NAVIGATION_PROMO_BANNER_CONFIG.img_url: Invalid type: Expected Object but received "https://example.com/promo.svg"',
      ]);
    });
  });
});

describe('footerSchema', () => {
  it('accepts the footer links', () => {
    expect(getValidationErrors(footerSchema, { NEXT_PUBLIC_FOOTER_LINKS: JSON.stringify(footerLinks) })).toEqual([]);
  });

  it('rejects a group without links', () => {
    expect(getValidationErrors(footerSchema, { NEXT_PUBLIC_FOOTER_LINKS: JSON.stringify([ { title: 'Foo' } ]) })).toEqual([
      'NEXT_PUBLIC_FOOTER_LINKS.0.links: Invalid key: Expected "links" but received undefined',
    ]);
  });

  it('rejects a link with a malformed icon URL', () => {
    expect(getValidationErrors(footerSchema, {
      NEXT_PUBLIC_FOOTER_LINKS: JSON.stringify([ { title: 'Foo', links: [ { text: 'Home', url: 'https://example.com', iconUrl: [ 'not a url' ] } ] } ]),
    })).toEqual([ 'NEXT_PUBLIC_FOOTER_LINKS.0.links.0.iconUrl.0: Invalid URL: Received "not a url"' ]);
  });
});

describe('miscSchema', () => {
  it('accepts the theme, font and alert settings', () => {
    expect(getValidationErrors(miscSchema, {
      NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS: 'false',
      NEXT_PUBLIC_HIDE_INDEXING_ALERT_INT_TXS: 'false',
      NEXT_PUBLIC_HIDE_NATIVE_COIN_PRICE: 'false',
      NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE: '<a href="#">Hello</a>',
      NEXT_PUBLIC_COLOR_THEMES: toEnvValue([ 'dim', 'dark' ]),
      NEXT_PUBLIC_COLOR_THEME_DEFAULT: 'dim',
      NEXT_PUBLIC_COLOR_THEME_OVERRIDES: toEnvValue({ light: { colors: { link: 'red' } } }),
      NEXT_PUBLIC_FONT_FAMILY_HEADING: toEnvValue(fontFamilyHeading),
      NEXT_PUBLIC_FONT_FAMILY_BODY: toEnvValue(fontFamilyBody),
      NEXT_PUBLIC_MAX_CONTENT_WIDTH_ENABLED: 'false',
    })).toEqual([]);
  });

  it.each([
    'NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS',
    'NEXT_PUBLIC_HIDE_INDEXING_ALERT_INT_TXS',
    'NEXT_PUBLIC_HIDE_NATIVE_COIN_PRICE',
    'NEXT_PUBLIC_MAX_CONTENT_WIDTH_ENABLED',
  ])('rejects a non-boolean %s', (name) => {
    expect(getValidationErrors(miscSchema, { [name]: 'yes' })).toEqual([ nonBooleanMessage(name) ]);
  });

  it('accepts an array of maintenance alert messages', () => {
    expect(getValidationErrors(miscSchema, {
      NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE: `['<a href="https://example.com">Hello</a>','Duck me']`,
    })).toEqual([]);
  });

  describe('color themes', () => {
    it('rejects an unknown theme id', () => {
      expect(getValidationErrors(miscSchema, { NEXT_PUBLIC_COLOR_THEMES: toEnvValue([ 'sepia' ]) })).toEqual([
        picklistMessage('NEXT_PUBLIC_COLOR_THEMES.0', [ 'light', 'dim', 'midnight', 'dark' ], 'sepia'),
      ]);
    });

    it('rejects an unknown default theme', () => {
      expect(getValidationErrors(miscSchema, { NEXT_PUBLIC_COLOR_THEME_DEFAULT: 'sepia' })).toEqual([
        picklistMessage('NEXT_PUBLIC_COLOR_THEME_DEFAULT', [ 'light', 'dim', 'midnight', 'dark' ], 'sepia'),
      ]);
    });

    it('accepts a default theme without a themes list', () => {
      expect(getValidationErrors(miscSchema, { NEXT_PUBLIC_COLOR_THEME_DEFAULT: 'dim' })).toEqual([]);
    });

    it('rejects a default theme that is not among the listed themes', () => {
      expect(getValidationErrors(miscSchema, {
        NEXT_PUBLIC_COLOR_THEMES: toEnvValue([ 'dim', 'dark' ]),
        NEXT_PUBLIC_COLOR_THEME_DEFAULT: 'light',
      })).toEqual([ 'NEXT_PUBLIC_COLOR_THEME_DEFAULT must be one of the themes listed in NEXT_PUBLIC_COLOR_THEMES' ]);
    });

    it('rejects theme overrides that are not a JSON object', () => {
      expect(getValidationErrors(miscSchema, { NEXT_PUBLIC_COLOR_THEME_OVERRIDES: 'not json' })).toEqual([
        'NEXT_PUBLIC_COLOR_THEME_OVERRIDES: Invalid JSON: Received "not json"',
      ]);
    });
  });

  it.each([
    'NEXT_PUBLIC_FONT_FAMILY_HEADING',
    'NEXT_PUBLIC_FONT_FAMILY_BODY',
  ])('rejects a %s with a malformed URL', (name) => {
    expect(getValidationErrors(miscSchema, { [name]: toEnvValue({ name: 'Montserrat', url: 'not a url' }) })).toEqual([
      `${ name }.url: Invalid URL: Received "not a url"`,
    ]);
  });
});

describe('viewsSchema', () => {
  it('accepts the block, address, contract, tx and token view settings', () => {
    expect(getValidationErrors(viewsSchema, {
      NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_FIELDS: toEnvValue([ 'burnt_fees', 'total_reward' ]),
      NEXT_PUBLIC_VIEWS_BLOCK_PENDING_UPDATE_ALERT_ENABLED: 'false',
      NEXT_PUBLIC_VIEWS_ADDRESS_IDENTICON_TYPE: 'gradient_avatar',
      NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT: toEnvValue([ 'base16' ]),
      NEXT_PUBLIC_VIEWS_ADDRESS_NATIVE_TOKEN_ADDRESS: '0x471EcE3750Da237f93B8E339c536989b8978a438',
      NEXT_PUBLIC_VIEWS_ADDRESS_HIDDEN_VIEWS: toEnvValue([ 'top_accounts' ]),
      NEXT_PUBLIC_VIEWS_CONTRACT_SOLIDITYSCAN_ENABLED: 'true',
      NEXT_PUBLIC_VIEWS_CONTRACT_DECODED_BYTECODE_ENABLED: 'true',
      NEXT_PUBLIC_VIEWS_CONTRACT_EXTRA_VERIFICATION_METHODS: toEnvValue([ 'solidity-hardhat', 'solidity-foundry' ]),
      NEXT_PUBLIC_VIEWS_TX_HIDDEN_FIELDS: toEnvValue([ 'value', 'fee_currency', 'gas_price', 'tx_fee', 'gas_fees', 'burnt_fees' ]),
      NEXT_PUBLIC_VIEWS_TX_ADDITIONAL_FIELDS: toEnvValue([ 'fee_per_gas', 'set_max_gas_limit' ]),
      NEXT_PUBLIC_VIEWS_TX_GROUPED_FEES: 'true',
      NEXT_PUBLIC_VIEWS_TX_HIDDEN_VIEWS: toEnvValue([ 'pending_txs' ]),
      NEXT_PUBLIC_INTERNAL_TXS_ENABLED: 'false',
      NEXT_PUBLIC_VIEWS_NFT_MARKETPLACES: toEnvValue(nftMarketplaces),
      NEXT_PUBLIC_VIEWS_TOKEN_SCAM_TOGGLE_ENABLED: 'true',
      NEXT_PUBLIC_HELIA_VERIFIED_FETCH_ENABLED: 'false',
      NEXT_PUBLIC_NETWORK_EXPLORERS: toEnvValue(networkExplorers),
      NEXT_PUBLIC_CONTRACT_CODE_IDES: toEnvValue(contractCodeIdes),
      NEXT_PUBLIC_HAS_CONTRACT_AUDIT_REPORTS: 'true',
    })).toEqual([]);
  });

  it.each([
    'NEXT_PUBLIC_VIEWS_BLOCK_PENDING_UPDATE_ALERT_ENABLED',
    'NEXT_PUBLIC_VIEWS_CONTRACT_SOLIDITYSCAN_ENABLED',
    'NEXT_PUBLIC_VIEWS_CONTRACT_DECODED_BYTECODE_ENABLED',
    'NEXT_PUBLIC_VIEWS_TX_GROUPED_FEES',
    'NEXT_PUBLIC_INTERNAL_TXS_ENABLED',
    'NEXT_PUBLIC_VIEWS_TOKEN_SCAM_TOGGLE_ENABLED',
    'NEXT_PUBLIC_HELIA_VERIFIED_FETCH_ENABLED',
    'NEXT_PUBLIC_HAS_CONTRACT_AUDIT_REPORTS',
  ])('rejects a non-boolean %s', (name) => {
    expect(getValidationErrors(viewsSchema, { [name]: 'yes' })).toEqual([ nonBooleanMessage(name) ]);
  });

  it.each([
    [ 'NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_FIELDS', '("base_fee" | "burnt_fees" | "total_reward" | "nonce" | "miner" | "L1_status" | "batch")' ],
    [ 'NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT', '("base16" | "bech32")' ],
    [ 'NEXT_PUBLIC_VIEWS_ADDRESS_HIDDEN_VIEWS', '"top_accounts"' ],
    [
      'NEXT_PUBLIC_VIEWS_TX_HIDDEN_FIELDS',
      '("value" | "fee_currency" | "gas_price" | "tx_fee" | "gas_fees" | "burnt_fees" | "batch" | "L1_status" | ' +
      '"L1_gas_used" | "L1_gas_price" | "L1_fee" | "L1_fee_scalar")',
    ],
    [ 'NEXT_PUBLIC_VIEWS_TX_ADDITIONAL_FIELDS', '("fee_per_gas" | "set_max_gas_limit")' ],
    [ 'NEXT_PUBLIC_VIEWS_TX_HIDDEN_VIEWS', '"pending_txs"' ],
  ])('rejects an unknown id in %s', (name, allowed) => {
    expect(getValidationErrors(viewsSchema, { [name]: toEnvValue([ 'unknown' ]) })).toEqual([
      `${ name }.0: Invalid type: Expected ${ allowed } but received "unknown"`,
    ]);
  });

  it('rejects an unknown identicon type', () => {
    expect(getValidationErrors(viewsSchema, { NEXT_PUBLIC_VIEWS_ADDRESS_IDENTICON_TYPE: 'robohash' })).toEqual([
      picklistMessage('NEXT_PUBLIC_VIEWS_ADDRESS_IDENTICON_TYPE', [ 'github', 'jazzicon', 'gradient_avatar', 'blockie', 'nouns' ], 'robohash'),
    ]);
  });

  describe('bech32 prefix', () => {
    it('is accepted together with the bech32 address format', () => {
      expect(getValidationErrors(viewsSchema, {
        NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT: toEnvValue([ 'base16', 'bech32' ]),
        NEXT_PUBLIC_VIEWS_ADDRESS_BECH_32_PREFIX: 'foo',
      })).toEqual([]);
    });

    it('is required when the bech32 address format is enabled', () => {
      expect(getValidationErrors(viewsSchema, { NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT: toEnvValue([ 'base16', 'bech32' ]) })).toEqual([
        'NEXT_PUBLIC_VIEWS_ADDRESS_BECH_32_PREFIX is required when NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT contains "bech32"',
      ]);
    });

    it('is rejected without the bech32 address format', () => {
      expect(getValidationErrors(viewsSchema, { NEXT_PUBLIC_VIEWS_ADDRESS_BECH_32_PREFIX: 'foo' })).toEqual([
        'NEXT_PUBLIC_VIEWS_ADDRESS_BECH_32_PREFIX is required if NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT contains "bech32"',
      ]);
    });
  });

  describe('native token address', () => {
    it('rejects an address of the wrong length', () => {
      expect(getValidationErrors(viewsSchema, { NEXT_PUBLIC_VIEWS_ADDRESS_NATIVE_TOKEN_ADDRESS: '0x471EcE3750Da237f' })).toEqual([
        'NEXT_PUBLIC_VIEWS_ADDRESS_NATIVE_TOKEN_ADDRESS: Invalid length: Expected 42 but received 18',
      ]);
    });

    it('rejects a non-hex address', () => {
      expect(getValidationErrors(viewsSchema, { NEXT_PUBLIC_VIEWS_ADDRESS_NATIVE_TOKEN_ADDRESS: '0xZZZEcE3750Da237f93B8E339c536989b8978a438' })).toEqual([
        'NEXT_PUBLIC_VIEWS_ADDRESS_NATIVE_TOKEN_ADDRESS: Invalid format: Expected /^0x[\\da-fA-F]+$/ but received "0xZZZEcE3750Da237f93B8E339c536989b8978a438"',
      ]);
    });
  });

  describe('extra contract verification methods', () => {
    it('accepts the "none" literal', () => {
      expect(getValidationErrors(viewsSchema, { NEXT_PUBLIC_VIEWS_CONTRACT_EXTRA_VERIFICATION_METHODS: 'none' })).toEqual([]);
    });

    it('rejects an unknown method id', () => {
      expect(getValidationErrors(viewsSchema, { NEXT_PUBLIC_VIEWS_CONTRACT_EXTRA_VERIFICATION_METHODS: toEnvValue([ 'vyper-brownie' ]) })).toEqual([
        'NEXT_PUBLIC_VIEWS_CONTRACT_EXTRA_VERIFICATION_METHODS: Invalid type: Expected "none" but received "[\'vyper-brownie\']"',
        picklistMessage('NEXT_PUBLIC_VIEWS_CONTRACT_EXTRA_VERIFICATION_METHODS.0', [ 'solidity-hardhat', 'solidity-foundry' ], 'vyper-brownie'),
      ]);
    });
  });

  it('rejects an NFT marketplace without a logo URL', () => {
    expect(getValidationErrors(viewsSchema, {
      NEXT_PUBLIC_VIEWS_NFT_MARKETPLACES: toEnvValue([ { name: 'NFT Marketplace', collection_url: 'https://example.com/{hash}' } ]),
    })).toEqual([ 'NEXT_PUBLIC_VIEWS_NFT_MARKETPLACES.0.logo_url: Invalid key: Expected "logo_url" but received undefined' ]);
  });

  it('rejects a network explorer with a malformed base URL', () => {
    expect(getValidationErrors(viewsSchema, {
      NEXT_PUBLIC_NETWORK_EXPLORERS: toEnvValue([ { ...networkExplorers[0], baseUrl: 'not a url' } ]),
    })).toEqual([ 'NEXT_PUBLIC_NETWORK_EXPLORERS.0.baseUrl: Invalid URL: Received "not a url"' ]);
  });

  it('rejects a contract code IDE without an icon URL', () => {
    expect(getValidationErrors(viewsSchema, {
      NEXT_PUBLIC_CONTRACT_CODE_IDES: toEnvValue([ { title: 'Remix IDE', url: 'https://remix.blockscout.com' } ]),
    })).toEqual([ 'NEXT_PUBLIC_CONTRACT_CODE_IDES.0.icon_url: Invalid key: Expected "icon_url" but received undefined' ]);
  });
});
