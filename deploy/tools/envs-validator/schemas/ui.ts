// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import type { AlternativeExplorer } from 'src/features/alternative-explorers/types/client';
import type { CustomLink, CustomLinksGroup } from 'src/shell/footer/types';
import { NETWORK_GROUPS } from 'src/shell/top-bar/chain-menu/types';
import type { FeaturedNetwork } from 'src/shell/top-bar/chain-menu/types';
import type { AddressFormat } from 'src/slices/address/types/config';
import { ADDRESS_FORMATS, ADDRESS_VIEWS_IDS, IDENTICON_TYPES } from 'src/slices/address/types/config';
import { BLOCK_FIELDS_IDS } from 'src/slices/block/types/config';
import type { ContractCodeIde } from 'src/slices/contract/types/config';
import { SMART_CONTRACT_EXTRA_VERIFICATION_METHODS } from 'src/slices/contract/types/config';
import type { HeroBannerButtonState, HeroBannerSearchBorderColorState } from 'src/slices/home/types/config';
import { CHAIN_INDICATOR_IDS, HOME_STATS_WIDGET_IDS } from 'src/slices/home/types/config';
import type { NftMarketplaceItem } from 'src/slices/token/types/client';
import { TX_ADDITIONAL_FIELDS_IDS, TX_FIELDS_IDS, TX_VIEWS_IDS } from 'src/slices/tx/types/config';

import type { ColorThemeId } from 'src/shell/top-bar/settings/color-theme/config';
import { COLOR_THEME_IDS } from 'src/shell/top-bar/settings/color-theme/config';

import * as regexp from 'src/toolkit/utils/regexp';

import { companionRule, envBoolean, envJson, envUrl, requiredIf, requires } from '../utils';

const requiredString = () => v.pipe(v.string(), v.nonEmpty());
const requiredUrl = () => v.pipe(v.string(), v.nonEmpty(), v.url());
const optionalUrl = () => v.optional(v.pipe(v.string(), v.url()));
const colorPair = () => v.optional(v.pipe(v.array(v.string()), v.maxLength(2)));

const heroBannerButtonStateSchema: v.GenericSchema<HeroBannerButtonState> = v.object({
  background: colorPair(),
  text_color: colorPair(),
});

const heroBannerSearchBorderColorSchema: v.GenericSchema<HeroBannerSearchBorderColorState> = v.object({
  _empty: colorPair(),
  _hover: colorPair(),
  _focus: colorPair(),
  _filled: colorPair(),
});

const heroBannerSchema = v.object({
  background: colorPair(),
  text_color: colorPair(),
  border: colorPair(),
  button: v.optional(v.object({
    _default: v.optional(heroBannerButtonStateSchema),
    _hover: v.optional(heroBannerButtonStateSchema),
    _selected: v.optional(heroBannerButtonStateSchema),
  })),
  search: v.optional(v.object({
    background: colorPair(),
    border_width: colorPair(),
    border_color: v.optional(heroBannerSearchBorderColorSchema),
  })),
  text: v.optional(v.string()),
});

const hasListItem = (value: unknown, item: string) => Array.isArray(value) && value.includes(item);

export const homepageSchema = v.pipe(
  v.looseObject({
    NEXT_PUBLIC_HOMEPAGE_CHARTS: v.optional(envJson(v.array(v.picklist(CHAIN_INDICATOR_IDS)))),
    NEXT_PUBLIC_HOMEPAGE_STATS: v.optional(envJson(v.array(v.picklist(HOME_STATS_WIDGET_IDS)))),
    NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG: v.optional(envJson(heroBannerSchema)),
  }),
  companionRule(
    [ 'NEXT_PUBLIC_HOMEPAGE_CHARTS', 'NEXT_PUBLIC_STATS_API_HOST' ],
    (input) => !hasListItem(input.NEXT_PUBLIC_HOMEPAGE_CHARTS, 'daily_operational_txs') || Boolean(input.NEXT_PUBLIC_STATS_API_HOST),
    'NEXT_PUBLIC_STATS_API_HOST is required when daily_operational_txs is enabled in NEXT_PUBLIC_HOMEPAGE_CHARTS',
  ),
  companionRule(
    [ 'NEXT_PUBLIC_HOMEPAGE_STATS', 'NEXT_PUBLIC_STATS_API_HOST' ],
    (input) => !hasListItem(input.NEXT_PUBLIC_HOMEPAGE_STATS, 'total_operational_txs') || Boolean(input.NEXT_PUBLIC_STATS_API_HOST),
    'NEXT_PUBLIC_STATS_API_HOST is required when total_operational_txs is enabled in NEXT_PUBLIC_HOMEPAGE_STATS',
  ),
);

const featuredNetworkSchema: v.GenericSchema<FeaturedNetwork> = v.object({
  title: requiredString(),
  url: requiredUrl(),
  group: v.picklist(NETWORK_GROUPS),
  icon: optionalUrl(),
  isActive: v.optional(v.boolean()),
  invertIconInDarkMode: v.optional(v.boolean()),
});

const navItemExternalSchema = v.object({
  text: requiredString(),
  url: requiredUrl(),
});

const colorModePairSchema = v.object({
  light: requiredString(),
  dark: requiredString(),
});

const promoBannerConfigSchema = v.union([
  v.object({
    img_url: requiredString(),
    text: requiredString(),
    bg_color: colorModePairSchema,
    text_color: colorModePairSchema,
    link_url: requiredString(),
  }),
  v.object({
    img_url: v.object({
      small: requiredString(),
      large: requiredString(),
    }),
    link_url: requiredString(),
  }),
]);

const hasItems = (value: unknown) => Array.isArray(value) && value.length > 0;

export const navigationSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_FEATURED_NETWORKS: v.optional(envJson(v.array(featuredNetworkSchema))),
    NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK: v.optional(envUrl()),
    NEXT_PUBLIC_FEATURED_NETWORKS_MODE: v.optional(v.picklist([ 'tabs', 'list' ])),
    NEXT_PUBLIC_OTHER_LINKS: v.optional(envJson(v.array(navItemExternalSchema))),
    NEXT_PUBLIC_NAVIGATION_HIGHLIGHTED_ROUTES: v.optional(envJson(v.array(v.string()))),
    NEXT_PUBLIC_NAVIGATION_LAYOUT: v.optional(v.picklist([ 'horizontal', 'vertical' ])),
    NEXT_PUBLIC_NAVIGATION_PROMO_BANNER_CONFIG: v.optional(envJson(promoBannerConfigSchema)),
    NEXT_PUBLIC_NETWORK_LOGO: v.optional(envUrl()),
    NEXT_PUBLIC_NETWORK_LOGO_DARK: v.optional(envUrl()),
    NEXT_PUBLIC_NETWORK_ICON: v.optional(envUrl()),
    NEXT_PUBLIC_NETWORK_ICON_DARK: v.optional(envUrl()),
  }),
  requires('NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK', 'NEXT_PUBLIC_FEATURED_NETWORKS', {
    when: hasItems,
    message: 'NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK can only be set when NEXT_PUBLIC_FEATURED_NETWORKS is configured',
  }),
  requires('NEXT_PUBLIC_FEATURED_NETWORKS_MODE', 'NEXT_PUBLIC_FEATURED_NETWORKS', {
    when: hasItems,
    message: 'NEXT_PUBLIC_FEATURED_NETWORKS_MODE can only be set when NEXT_PUBLIC_FEATURED_NETWORKS is configured',
  }),
);

const footerLinkSchema: v.GenericSchema<CustomLink> = v.object({
  text: requiredString(),
  url: requiredUrl(),
  iconUrl: v.optional(v.array(requiredUrl())),
});

const footerLinkGroupSchema: v.GenericSchema<CustomLinksGroup> = v.object({
  title: requiredString(),
  links: v.array(footerLinkSchema),
});

export const footerSchema = v.object({
  NEXT_PUBLIC_FOOTER_LINKS: v.optional(envJson(v.array(footerLinkGroupSchema))),
});

const fontFamilySchema = v.object({
  name: requiredString(),
  url: requiredUrl(),
});

export const miscSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS: v.optional(envBoolean()),
    NEXT_PUBLIC_HIDE_INDEXING_ALERT_INT_TXS: v.optional(envBoolean()),
    NEXT_PUBLIC_HIDE_NATIVE_COIN_PRICE: v.optional(envBoolean()),
    NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE: v.optional(v.union([ envJson(v.array(v.string())), v.string() ])),
    NEXT_PUBLIC_COLOR_THEMES: v.optional(envJson(v.array(v.picklist(COLOR_THEME_IDS)))),
    NEXT_PUBLIC_COLOR_THEME_DEFAULT: v.optional(v.picklist(COLOR_THEME_IDS)),
    NEXT_PUBLIC_COLOR_THEME_OVERRIDES: v.optional(envJson(v.record(v.string(), v.unknown()))),
    NEXT_PUBLIC_FONT_FAMILY_HEADING: v.optional(envJson(fontFamilySchema)),
    NEXT_PUBLIC_FONT_FAMILY_BODY: v.optional(envJson(fontFamilySchema)),
    NEXT_PUBLIC_MAX_CONTENT_WIDTH_ENABLED: v.optional(envBoolean()),
  }),
  companionRule(
    [ 'NEXT_PUBLIC_COLOR_THEME_DEFAULT', 'NEXT_PUBLIC_COLOR_THEMES' ],
    (input) => {
      const defaultTheme = input.NEXT_PUBLIC_COLOR_THEME_DEFAULT as ColorThemeId | undefined;
      const themes = input.NEXT_PUBLIC_COLOR_THEMES as Array<ColorThemeId> | undefined;
      return !defaultTheme || !themes?.length || themes.includes(defaultTheme);
    },
    'NEXT_PUBLIC_COLOR_THEME_DEFAULT must be one of the themes listed in NEXT_PUBLIC_COLOR_THEMES',
  ),
);

const networkExplorerSchema: v.GenericSchema<AlternativeExplorer> = v.object({
  title: requiredString(),
  logo: optionalUrl(),
  baseUrl: requiredUrl(),
  paths: v.object({
    tx: v.optional(v.string()),
    address: v.optional(v.string()),
    token: v.optional(v.string()),
    block: v.optional(v.string()),
    blob: v.optional(v.string()),
  }),
});

const contractCodeIdeSchema: v.GenericSchema<ContractCodeIde> = v.object({
  title: requiredString(),
  url: requiredUrl(),
  icon_url: requiredUrl(),
});

const nftMarketplaceSchema: v.GenericSchema<NftMarketplaceItem> = v.object({
  name: requiredString(),
  collection_url: optionalUrl(),
  instance_url: optionalUrl(),
  logo_url: requiredUrl(),
});

const BECH32_PREFIX_MAX_LENGTH = 83;
const ADDRESS_LENGTH = 42;

const hasBech32Format = (value: unknown) => Array.isArray(value) && (value as Array<AddressFormat>).includes('bech32');

export const viewsSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_FIELDS: v.optional(envJson(v.array(v.picklist(BLOCK_FIELDS_IDS)))),
    NEXT_PUBLIC_VIEWS_BLOCK_PENDING_UPDATE_ALERT_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_VIEWS_ADDRESS_IDENTICON_TYPE: v.optional(v.picklist(IDENTICON_TYPES)),
    NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT: v.optional(envJson(v.array(v.picklist(ADDRESS_FORMATS)))),
    NEXT_PUBLIC_VIEWS_ADDRESS_BECH_32_PREFIX: v.optional(v.pipe(v.string(), v.nonEmpty(), v.maxLength(BECH32_PREFIX_MAX_LENGTH))),
    NEXT_PUBLIC_VIEWS_ADDRESS_NATIVE_TOKEN_ADDRESS: v.optional(v.pipe(v.string(), v.length(ADDRESS_LENGTH), v.regex(regexp.HEX_REGEXP_WITH_0X))),
    NEXT_PUBLIC_VIEWS_ADDRESS_HIDDEN_VIEWS: v.optional(envJson(v.array(v.picklist(ADDRESS_VIEWS_IDS)))),
    NEXT_PUBLIC_VIEWS_CONTRACT_SOLIDITYSCAN_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_VIEWS_CONTRACT_DECODED_BYTECODE_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_VIEWS_CONTRACT_EXTRA_VERIFICATION_METHODS: v.optional(v.union([
      v.literal('none'),
      envJson(v.array(v.picklist(SMART_CONTRACT_EXTRA_VERIFICATION_METHODS))),
    ])),
    NEXT_PUBLIC_VIEWS_TX_HIDDEN_FIELDS: v.optional(envJson(v.array(v.picklist(TX_FIELDS_IDS)))),
    NEXT_PUBLIC_VIEWS_TX_ADDITIONAL_FIELDS: v.optional(envJson(v.array(v.picklist(TX_ADDITIONAL_FIELDS_IDS)))),
    NEXT_PUBLIC_VIEWS_TX_GROUPED_FEES: v.optional(envBoolean()),
    NEXT_PUBLIC_VIEWS_TX_HIDDEN_VIEWS: v.optional(envJson(v.array(v.picklist(TX_VIEWS_IDS)))),
    NEXT_PUBLIC_INTERNAL_TXS_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_VIEWS_NFT_MARKETPLACES: v.optional(envJson(v.array(nftMarketplaceSchema))),
    NEXT_PUBLIC_VIEWS_TOKEN_SCAM_TOGGLE_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_HELIA_VERIFIED_FETCH_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_NETWORK_EXPLORERS: v.optional(envJson(v.array(networkExplorerSchema))),
    NEXT_PUBLIC_CONTRACT_CODE_IDES: v.optional(envJson(v.array(contractCodeIdeSchema))),
    NEXT_PUBLIC_HAS_CONTRACT_AUDIT_REPORTS: v.optional(envBoolean()),
  }),
  requires('NEXT_PUBLIC_VIEWS_ADDRESS_BECH_32_PREFIX', 'NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT', {
    when: hasBech32Format,
    message: 'NEXT_PUBLIC_VIEWS_ADDRESS_BECH_32_PREFIX is required if NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT contains "bech32"',
  }),
  requiredIf('NEXT_PUBLIC_VIEWS_ADDRESS_BECH_32_PREFIX', 'NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT', {
    when: hasBech32Format,
    message: 'NEXT_PUBLIC_VIEWS_ADDRESS_BECH_32_PREFIX is required when NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT contains "bech32"',
  }),
);
