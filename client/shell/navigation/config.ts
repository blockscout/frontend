// SPDX-License-Identifier: LicenseRef-Blockscout

import { parseEnvJson, getEnvValue } from 'client/config/utils/envs';

import type { NavigationLayout, NavigationPromoBannerConfig, NavItemExternal } from './types';

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
