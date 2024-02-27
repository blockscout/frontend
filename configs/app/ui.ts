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
    charts: parseEnvJson<Array<ChainIndicatorId>>(getEnvValue('NEXT_PUBLIC_HOMEPAGE_CHARTS')) || [],
    plate: {
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
