// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AlternativeExplorer } from 'client/features/alternative-explorers/types/client';
import { type NavItemExternal, type NavigationLayout, type NavigationPromoBannerConfig } from 'client/shell/navigation/types';
import type { ContractCodeIde } from 'client/slices/contract/types/config';

import { COLOR_THEMES, type ColorTheme, type ColorThemeId } from 'client/shell/top-bar/settings/color-theme/config';

import homepage from '../slices/home/config';
import { getEnvValue, getExternalAssetFilePath, parseEnvJson } from './utils/envs';
import * as views from './views';

export interface FontFamily {
  name: string;
  url: string;
}

const highlightedRoutes = (() => {
  const parsedValue = parseEnvJson<Array<string>>(getEnvValue('NEXT_PUBLIC_NAVIGATION_HIGHLIGHTED_ROUTES'));
  return Array.isArray(parsedValue) ? parsedValue : [];
})();

const defaultColorTheme = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_COLOR_THEME_DEFAULT') as ColorThemeId | undefined;
  return COLOR_THEMES.find((theme) => theme.id === envValue) as ColorTheme | undefined;
})();

const navigationPromoBanner = (() => {
  const envValue = parseEnvJson<NavigationPromoBannerConfig>(getEnvValue('NEXT_PUBLIC_NAVIGATION_PROMO_BANNER_CONFIG'));
  return envValue || undefined;
})();

const maintenanceAlertMessage = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE');
  const parsedValue = envValue ? parseEnvJson<Array<string>>(envValue) : undefined;

  if (!parsedValue || !Array.isArray(parsedValue)) {
    return envValue;
  }

  if (parsedValue.length < 2) {
    return parsedValue[0];
  }

  const index = Math.floor(Math.random() * parsedValue.length);

  return parsedValue[index];
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
    highlightedRoutes,
    otherLinks: parseEnvJson<Array<NavItemExternal>>(getEnvValue('NEXT_PUBLIC_OTHER_LINKS')) || [],
    layout: (getEnvValue('NEXT_PUBLIC_NAVIGATION_LAYOUT') || 'vertical') as NavigationLayout,
    promoBanner: navigationPromoBanner,
  },
  featuredNetworks: {
    items: getExternalAssetFilePath('NEXT_PUBLIC_FEATURED_NETWORKS'),
    allLink: getEnvValue('NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK'),
    mode: (getEnvValue('NEXT_PUBLIC_FEATURED_NETWORKS_MODE') || 'list') as 'tabs' | 'list',
  },
  footer: {
    links: getExternalAssetFilePath('NEXT_PUBLIC_FOOTER_LINKS'),
    frontendVersion: getEnvValue('NEXT_PUBLIC_GIT_TAG'),
    frontendCommit: getEnvValue('NEXT_PUBLIC_GIT_COMMIT_SHA'),
  },
  homepage,
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
    message: maintenanceAlertMessage,
  },
  apiKeysAlert: {
    message: getEnvValue('NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE'),
  },
  explorers: {
    items: parseEnvJson<Array<AlternativeExplorer>>(getEnvValue('NEXT_PUBLIC_NETWORK_EXPLORERS')) || [],
  },
  ides: {
    items: parseEnvJson<Array<ContractCodeIde>>(getEnvValue('NEXT_PUBLIC_CONTRACT_CODE_IDES')) || [],
  },
  hasContractAuditReports: getEnvValue('NEXT_PUBLIC_HAS_CONTRACT_AUDIT_REPORTS') === 'true' ? true : false,
  colorTheme: {
    'default': defaultColorTheme,
    overrides: parseEnvJson<Record<string, unknown>>(getEnvValue('NEXT_PUBLIC_COLOR_THEME_OVERRIDES')) || {},
  },
  fonts: {
    heading: parseEnvJson<FontFamily>(getEnvValue('NEXT_PUBLIC_FONT_FAMILY_HEADING')),
    body: parseEnvJson<FontFamily>(getEnvValue('NEXT_PUBLIC_FONT_FAMILY_BODY')),
  },
  maxContentWidth: getEnvValue('NEXT_PUBLIC_MAX_CONTENT_WIDTH_ENABLED') === 'false' ? false : true,
  nativeCoinPrice: {
    isHidden: getEnvValue('NEXT_PUBLIC_HIDE_NATIVE_COIN_PRICE') === 'true' ? true : false,
  },
});

export default UI;
