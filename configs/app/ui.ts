import type { ContractCodeIde } from 'types/client/contract';
import { NAVIGATION_LINK_IDS, type NavItemExternal, type NavigationLinkId, type NavigationLayout } from 'types/client/navigation';
import { HOME_STATS_WIDGET_IDS, type ChainIndicatorId, type HeroBannerConfig, type HomeStatsWidgetId } from 'types/homepage';
import type { NetworkExplorer } from 'types/networks';
import type { ColorThemeId } from 'types/settings';
import type { FontFamily } from 'types/ui';

import { COLOR_THEMES, type ColorTheme } from 'lib/settings/colorTheme';

import * as features from './features';
import * as views from './ui/views';
import { getEnvValue, getExternalAssetFilePath, parseEnvJson } from './utils';

const hiddenLinks = (() => {
  const parsedValue = parseEnvJson<Array<NavigationLinkId>>(getEnvValue('NEXT_PUBLIC_NAVIGATION_HIDDEN_LINKS')) || [];

  if (!Array.isArray(parsedValue)) {
    return undefined;
  }

  const result = NAVIGATION_LINK_IDS.reduce((result, item) => {
    result[item] = parsedValue.includes(item);
    return result;
  }, {} as Record<NavigationLinkId, boolean>);

  return result;
})();

const homePageStats: Array<HomeStatsWidgetId> = (() => {
  const parsedValue = parseEnvJson<Array<HomeStatsWidgetId>>(getEnvValue('NEXT_PUBLIC_HOMEPAGE_STATS'));

  if (!Array.isArray(parsedValue)) {
    const rollupFeature = features.rollup;

    if (rollupFeature.isEnabled && [ 'zkEvm', 'zkSync', 'arbitrum' ].includes(rollupFeature.type)) {
      return [ 'latest_batch', 'average_block_time', 'total_txs', 'wallet_addresses', 'gas_tracker' ];
    }

    return [ 'total_blocks', 'average_block_time', 'total_txs', 'wallet_addresses', 'gas_tracker' ];
  }

  return parsedValue.filter((item) => HOME_STATS_WIDGET_IDS.includes(item));
})();

const highlightedRoutes = (() => {
  const parsedValue = parseEnvJson<Array<NavigationLinkId>>(getEnvValue('NEXT_PUBLIC_NAVIGATION_HIGHLIGHTED_ROUTES'));
  return Array.isArray(parsedValue) ? parsedValue : [];
})();

const defaultColorTheme = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_COLOR_THEME_DEFAULT') as ColorThemeId | undefined;
  return COLOR_THEMES.find((theme) => theme.id === envValue) as ColorTheme | undefined;
})();

const UI = Object.freeze({
  navigation: {
    logo: {
      'default': getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO'),
      dark: getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO_DARK'),
    },
    icon: {
      'default': getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_ICON'),
      dark: getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_ICON_DARK'),
    },
    hiddenLinks,
    highlightedRoutes,
    otherLinks: parseEnvJson<Array<NavItemExternal>>(getEnvValue('NEXT_PUBLIC_OTHER_LINKS')) || [],
    featuredNetworks: getExternalAssetFilePath('NEXT_PUBLIC_FEATURED_NETWORKS'),
    layout: (getEnvValue('NEXT_PUBLIC_NAVIGATION_LAYOUT') || 'vertical') as NavigationLayout,
  },
  footer: {
    links: getExternalAssetFilePath('NEXT_PUBLIC_FOOTER_LINKS'),
    frontendVersion: getEnvValue('NEXT_PUBLIC_GIT_TAG'),
    frontendCommit: getEnvValue('NEXT_PUBLIC_GIT_COMMIT_SHA'),
  },
  homepage: {
    charts: parseEnvJson<Array<ChainIndicatorId>>(getEnvValue('NEXT_PUBLIC_HOMEPAGE_CHARTS')) || [],
    stats: homePageStats,
    heroBanner: parseEnvJson<HeroBannerConfig>(getEnvValue('NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG')),
    // !!! DEPRECATED !!!
    plate: {
      background: getEnvValue('NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND'),
      textColor: getEnvValue('NEXT_PUBLIC_HOMEPAGE_PLATE_TEXT_COLOR'),
    },
  },
  views,
  indexingAlert: {
    blocks: {
      isHidden: getEnvValue('NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS') === 'true' ? true : false,
    },
    intTxs: {
      isHidden: getEnvValue('NEXT_PUBLIC_HIDE_INDEXING_ALERT_INT_TXS') === 'true' ? true : false,
    },
  },
  maintenanceAlert: {
    message: getEnvValue('NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE'),
  },
  explorers: {
    items: parseEnvJson<Array<NetworkExplorer>>(getEnvValue('NEXT_PUBLIC_NETWORK_EXPLORERS')) || [],
  },
  ides: {
    items: parseEnvJson<Array<ContractCodeIde>>(getEnvValue('NEXT_PUBLIC_CONTRACT_CODE_IDES')) || [],
  },
  hasContractAuditReports: getEnvValue('NEXT_PUBLIC_HAS_CONTRACT_AUDIT_REPORTS') === 'true' ? true : false,
  colorTheme: {
    'default': defaultColorTheme,
  },
  fonts: {
    heading: parseEnvJson<FontFamily>(getEnvValue('NEXT_PUBLIC_FONT_FAMILY_HEADING')),
    body: parseEnvJson<FontFamily>(getEnvValue('NEXT_PUBLIC_FONT_FAMILY_BODY')),
  },
  maxContentWidth: getEnvValue('NEXT_PUBLIC_MAX_CONTENT_WIDTH_ENABLED') === 'false' ? false : true,
});

export default UI;
