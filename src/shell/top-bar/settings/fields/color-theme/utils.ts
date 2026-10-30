// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';

import type { ColorMode } from 'src/toolkit/chakra/color-mode';

import type { ColorThemeId, ConcreteColorThemeId } from './config';
import { COLOR_THEMES, SYSTEM_COLOR_THEME_ID, isConcreteColorTheme } from './config';

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

export function getThemeHexWithOverrides(colorThemeId: ConcreteColorThemeId): string | undefined {
  const defaultHex = COLOR_THEMES.filter(isConcreteColorTheme).find((theme) => theme.id === colorThemeId)?.hex;

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

export function isColorThemeAvailable(colorThemeId: string): colorThemeId is ColorThemeId {
  return config.shell.topBar.colorTheme.themes.some((theme) => theme.id === colorThemeId);
}

export function getDefaultColorTheme(colorMode: ColorMode): ConcreteColorThemeId {
  const themes = config.shell.topBar.colorTheme.themes.filter(isConcreteColorTheme);
  const colorTheme = themes.filter((theme) => theme.colorMode === colorMode).slice(-1)[0];

  return (colorTheme ?? themes[0]).id;
}

export function resolveColorTheme(colorThemeId: ColorThemeId, prefersDark: boolean): ConcreteColorThemeId {
  if (colorThemeId === SYSTEM_COLOR_THEME_ID) {
    return getDefaultColorTheme(prefersDark ? 'dark' : 'light');
  }

  return colorThemeId;
}

interface InitialColorThemeParams {
  readonly cookieColorMode: ColorMode | undefined;
  readonly cookieColorTheme: string | undefined;
  readonly prefersDark: boolean;
}

export function getInitialColorTheme({ cookieColorMode, cookieColorTheme, prefersDark }: InitialColorThemeParams): ColorThemeId {
  if (cookieColorTheme && isColorThemeAvailable(cookieColorTheme)) {
    return cookieColorTheme;
  }

  if (cookieColorMode) {
    return getDefaultColorTheme(cookieColorMode);
  }

  const defaultTheme = config.shell.topBar.colorTheme.default;
  if (defaultTheme) {
    return defaultTheme.id;
  }

  return getDefaultColorTheme(prefersDark ? 'dark' : 'light');
}
