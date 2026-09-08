// SPDX-License-Identifier: LicenseRef-Blockscout

import { COLOR_THEMES, type ColorTheme, type ColorThemeId } from 'src/shell/top-bar/settings/color-theme/config';

import { getExternalAssetFilePath, getEnvValue, parseEnvJson } from 'src/config/utils/envs';

const availableColorThemes = (() => {
  const envValue = parseEnvJson<Array<ColorThemeId>>(getEnvValue('NEXT_PUBLIC_COLOR_THEMES'));
  const themes = Array.isArray(envValue) ? COLOR_THEMES.filter((theme) => envValue.includes(theme.id)) : [];

  return themes.length > 0 ? themes : COLOR_THEMES;
})();

const defaultColorTheme = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_COLOR_THEME_DEFAULT') as ColorThemeId | undefined;
  const theme = availableColorThemes.find((theme) => theme.id === envValue) as ColorTheme | undefined;

  if (theme) {
    return theme;
  }

  const coversBothColorModes = availableColorThemes.some((theme) => theme.colorMode === 'light') &&
    availableColorThemes.some((theme) => theme.colorMode === 'dark');

  return coversBothColorModes ? undefined : availableColorThemes.slice(-1)[0];
})();

const config = Object.freeze({
  chainMenu: {
    items: getExternalAssetFilePath('NEXT_PUBLIC_FEATURED_NETWORKS'),
    allLink: getEnvValue('NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK'),
    mode: (getEnvValue('NEXT_PUBLIC_FEATURED_NETWORKS_MODE') || 'list') as 'tabs' | 'list',
  },
  colorTheme: {
    themes: availableColorThemes,
    'default': defaultColorTheme,
    overrides: parseEnvJson<Record<string, unknown>>(getEnvValue('NEXT_PUBLIC_COLOR_THEME_OVERRIDES')) || {},
  },
});

export default config;
