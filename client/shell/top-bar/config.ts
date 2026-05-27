// SPDX-License-Identifier: LicenseRef-Blockscout

import { getExternalAssetFilePath, getEnvValue, parseEnvJson } from 'client/config/utils/envs';

import { COLOR_THEMES, type ColorTheme, type ColorThemeId } from 'client/shell/top-bar/settings/color-theme/config';

const defaultColorTheme = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_COLOR_THEME_DEFAULT') as ColorThemeId | undefined;
  return COLOR_THEMES.find((theme) => theme.id === envValue) as ColorTheme | undefined;
})();

const config = Object.freeze({
  chainMenu: {
    items: getExternalAssetFilePath('NEXT_PUBLIC_FEATURED_NETWORKS'),
    allLink: getEnvValue('NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK'),
    mode: (getEnvValue('NEXT_PUBLIC_FEATURED_NETWORKS_MODE') || 'list') as 'tabs' | 'list',
  },
  colorTheme: {
    'default': defaultColorTheme,
    overrides: parseEnvJson<Record<string, unknown>>(getEnvValue('NEXT_PUBLIC_COLOR_THEME_OVERRIDES')) || {},
  },
});

export default config;
