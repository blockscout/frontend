import type { ContractCodeIde } from 'types/client/contract';
import { NAVIGATION_LINK_IDS, type NavItemExternal, type NavigationLinkId } from 'types/client/navigation-items';
import type { ChainIndicatorId } from 'types/homepage';
import type { NetworkExplorer } from 'types/networks';

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

// eslint-disable-next-line max-len
const HOMEPAGE_PLATE_BACKGROUND_DEFAULT = 'radial-gradient(103.03% 103.03% at 0% 0%, rgba(183, 148, 244, 0.8) 0%, rgba(0, 163, 196, 0.8) 100%), var(--chakra-colors-blue-400)';

const UI = Object.freeze({
  theme: {
    initialColorMode: (getEnvValue('NEXT_PUBLIC_THEME_INITIAL_COLOR_MODE') as ('system' | 'light' | 'dark' | undefined)) || 'system',
    statisticBgColor: getEnvValue('NEXT_PUBLIC_THEME_STATISTIC_BG_COLOR'),
    statisticBgDarkColor: getEnvValue('NEXT_PUBLIC_THEME_STATISTIC_BG_DARK_COLOR'),
    statisticTextColor: getEnvValue('NEXT_PUBLIC_THEME_STATISTIC_TEXT_COLOR'),
    statisticTextDarkColor: getEnvValue('NEXT_PUBLIC_THEME_STATISTIC_TEXT_DARK_COLOR'),
    linkColor: getEnvValue('NEXT_PUBLIC_THEME_LINK_COLOR') || 'blue.600',
    linkDarkColor: getEnvValue('NEXT_PUBLIC_THEME_LINK_DARK_COLOR') || 'blue.300',
    linkHoverColor: getEnvValue('NEXT_PUBLIC_THEME_LINK_HOVER_COLOR') || 'blue.400',
    linkHoverDarkColor: getEnvValue('NEXT_PUBLIC_THEME_LINK_HOVER_DARK_COLOR') || 'blue.200',
    textColor: getEnvValue('NEXT_PUBLIC_THEME_TEXT_COLOR') || 'blackAlpha.800',
    textDarkColor: getEnvValue('NEXT_PUBLIC_THEME_TEXT_DARK_COLOR') || 'whiteAlpha.800',
    textSecondaryColor: getEnvValue('NEXT_PUBLIC_THEME_TEXT_SECONDARY_COLOR') || 'gray.500',
    textSecondaryDarkColor: getEnvValue('NEXT_PUBLIC_THEME_TEXT_SECONDARY_DARK_COLOR') || 'gray.400',
    errorColor: getEnvValue('NEXT_PUBLIC_THEME_ERROR_COLOR') || 'red.400',
    errorDarkColor: getEnvValue('NEXT_PUBLIC_THEME_ERROR_DARK_COLOR') || 'red.300',
    dividerColor: getEnvValue('NEXT_PUBLIC_THEME_DIVIDER_COLOR') || 'blackAlpha.200',
    dividerDarkColor: getEnvValue('NEXT_PUBLIC_THEME_DIVIDER_DARK_COLOR') || 'whiteAlpha.200',
  },
  sidebar: {
    logo: {
      'default': getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO'),
      dark: getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO_DARK'),
    },
    icon: {
      'default': getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_ICON'),
      dark: getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_ICON_DARK'),
    },
    hiddenLinks,
    otherLinks: parseEnvJson<Array<NavItemExternal>>(getEnvValue('NEXT_PUBLIC_OTHER_LINKS')) || [],
    featuredNetworks: getExternalAssetFilePath('NEXT_PUBLIC_FEATURED_NETWORKS'),
  },
  footer: {
    links: getExternalAssetFilePath('NEXT_PUBLIC_FOOTER_LINKS'),
    frontendVersion: getEnvValue('NEXT_PUBLIC_GIT_TAG'),
    frontendCommit: getEnvValue('NEXT_PUBLIC_GIT_COMMIT_SHA'),
  },
  homepage: {
    title: getEnvValue('NEXT_PUBLIC_HOMEPAGE_TITLE') || 'blockchain explorer',
    charts: parseEnvJson<Array<ChainIndicatorId>>(getEnvValue('NEXT_PUBLIC_HOMEPAGE_CHARTS')) || [],
    plate: {
      bgImageURL: getExternalAssetFilePath('NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND_IMAGE'),
      title: getEnvValue('NEXT_PUBLIC_HOMEPAGE_PLATE_TITLE') || `${ getEnvValue('NEXT_PUBLIC_NETWORK_NAME') } explorer`,
      background: getEnvValue('NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND') || HOMEPAGE_PLATE_BACKGROUND_DEFAULT,
      textColor: getEnvValue('NEXT_PUBLIC_HOMEPAGE_PLATE_TEXT_COLOR') || 'white',
    },
    showAvgBlockTime: getEnvValue('NEXT_PUBLIC_HOMEPAGE_SHOW_AVG_BLOCK_TIME') === 'false' ? false : true,
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
});

export default UI;
