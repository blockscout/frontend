// SPDX-License-Identifier: LicenseRef-Blockscout

import {
  COLOR_THEMES,
  isConcreteColorTheme,
  isSystemColorTheme,
  type ColorTheme,
  type ColorThemeId,
} from 'src/shell/top-bar/settings/color-theme/config';

import { getExternalAssetFilePath, getEnvValue, parseEnvJson } from 'src/config/utils/envs';

function coversBothColorModes(themes: Array<ColorTheme>): boolean {
  return themes.some((theme) => theme.colorMode === 'light') && themes.some((theme) => theme.colorMode === 'dark');
}

const availableColorThemes = (() => {
  const envValue = parseEnvJson<Array<ColorThemeId>>(getEnvValue('NEXT_PUBLIC_COLOR_THEMES'));
  const listedThemes = Array.isArray(envValue) ? COLOR_THEMES.filter((theme) => envValue.includes(theme.id)) : [];
  const themes = listedThemes.some(isConcreteColorTheme) ? listedThemes : COLOR_THEMES;

  return coversBothColorModes(themes) ? themes : themes.filter(isConcreteColorTheme);
})();

const defaultColorTheme = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_COLOR_THEME_DEFAULT') as ColorThemeId | undefined;
  const theme = availableColorThemes.find((theme) => theme.id === envValue);

  if (theme) {
    return theme;
  }

  if (coversBothColorModes(availableColorThemes)) {
    return availableColorThemes.find(isSystemColorTheme);
  }

  return availableColorThemes.slice(-1)[0];
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
