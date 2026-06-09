// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NavigationLayout, NavigationPromoBannerConfig, NavItemExternal } from './types';

import { parseEnvJson, getEnvValue } from 'src/config/utils/envs';

const highlightedRoutes = (() => {
  const parsedValue = parseEnvJson<Array<string>>(getEnvValue('NEXT_PUBLIC_NAVIGATION_HIGHLIGHTED_ROUTES'));
  return Array.isArray(parsedValue) ? parsedValue : [];
})();

const navigationPromoBanner = (() => {
  const envValue = parseEnvJson<NavigationPromoBannerConfig>(getEnvValue('NEXT_PUBLIC_NAVIGATION_PROMO_BANNER_CONFIG'));
  return envValue || undefined;
})();

const config = Object.freeze({
  highlightedRoutes,
  otherLinks: parseEnvJson<Array<NavItemExternal>>(getEnvValue('NEXT_PUBLIC_OTHER_LINKS')) || [],
  layout: (getEnvValue('NEXT_PUBLIC_NAVIGATION_LAYOUT') || 'vertical') as NavigationLayout,
  promoBanner: navigationPromoBanner,
});

export default config;
