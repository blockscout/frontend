// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';

import type { ColorMode } from 'toolkit/chakra/color-mode';

import type { ColorThemeId } from './config';
import { COLOR_THEMES } from './config';

const getNestedValue = (obj: Record<string, unknown>, property: string) => {
  const keys = property.split('.');
  let current = obj;
  for (const key of keys) {
    const value = current[key];
    if (value === undefined) {
      return undefined;
    }
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      current = value as Record<string, unknown>;
    } else {
      return value;
    }
  }
};

export function getThemeHexWithOverrides(colorThemeId: ColorThemeId) {
  const defaultHex = COLOR_THEMES.find((theme) => theme.id === colorThemeId)?.hex;

  if (!defaultHex) {
    return;
  }

  const overrides = config.shell.topBar.colorTheme.overrides;
  if (colorThemeId === 'light') {
    const value = getNestedValue(overrides, 'bg.primary._light.value');
    return typeof value === 'string' ? value : defaultHex;
  }

  if (colorThemeId === 'dark') {
    const value = getNestedValue(overrides, 'bg.primary._dark.value');
    return typeof value === 'string' ? value : defaultHex;
  }

  return defaultHex;
};

export function getDefaultColorTheme(colorMode: ColorMode) {
  const colorTheme = COLOR_THEMES.filter((theme) => theme.colorMode === colorMode).slice(-1)[0];

  return colorTheme.id;
}
