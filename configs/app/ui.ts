import type { NavItemExternal } from 'types/client/navigation-items';
import type { NetworkExplorer } from 'types/networks';
import type { ChainIndicatorId } from 'ui/home/indicators/types';

import * as views from './ui/views';
import { getEnvValue, parseEnvJson } from './utils';

// eslint-disable-next-line max-len
const HOMEPAGE_PLATE_BACKGROUND_DEFAULT = 'radial-gradient(103.03% 103.03% at 0% 0%, rgba(183, 148, 244, 0.8) 0%, rgba(0, 163, 196, 0.8) 100%), var(--chakra-colors-blue-400)';

const UI = Object.freeze({
  sidebar: {
    logo: {
      'default': getEnvValue(process.env.NEXT_PUBLIC_NETWORK_LOGO),
      dark: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_LOGO_DARK),
    },
    icon: {
      'default': getEnvValue(process.env.NEXT_PUBLIC_NETWORK_ICON),
      dark: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_ICON_DARK),
    },
    otherLinks: parseEnvJson<Array<NavItemExternal>>(getEnvValue(process.env.NEXT_PUBLIC_OTHER_LINKS)) || [],
    featuredNetworks: getEnvValue(process.env.NEXT_PUBLIC_FEATURED_NETWORKS),
  },
  footer: {
    links: getEnvValue(process.env.NEXT_PUBLIC_FOOTER_LINKS),
    frontendVersion: getEnvValue(process.env.NEXT_PUBLIC_GIT_TAG),
    frontendCommit: getEnvValue(process.env.NEXT_PUBLIC_GIT_COMMIT_SHA),
  },
  homepage: {
    charts: parseEnvJson<Array<ChainIndicatorId>>(getEnvValue(process.env.NEXT_PUBLIC_HOMEPAGE_CHARTS)) || [],
    plate: {
      background: getEnvValue(process.env.NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND) || HOMEPAGE_PLATE_BACKGROUND_DEFAULT,
      textColor: getEnvValue(process.env.NEXT_PUBLIC_HOMEPAGE_PLATE_TEXT_COLOR) || 'white',
    },
    showGasTracker: getEnvValue(process.env.NEXT_PUBLIC_HOMEPAGE_SHOW_GAS_TRACKER) === 'false' ? false : true,
    showAvgBlockTime: getEnvValue(process.env.NEXT_PUBLIC_HOMEPAGE_SHOW_AVG_BLOCK_TIME) === 'false' ? false : true,
  },
  views,
  indexingAlert: {
    isHidden: getEnvValue(process.env.NEXT_PUBLIC_HIDE_INDEXING_ALERT),
  },
  explorers: {
    items: parseEnvJson<Array<NetworkExplorer>>(getEnvValue(process.env.NEXT_PUBLIC_NETWORK_EXPLORERS)) || [],
  },
});

export default UI;
