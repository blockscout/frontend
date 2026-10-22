// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ConditionalValue } from '@chakra-ui/react';

import type { ColorMode } from 'src/toolkit/chakra/color-mode';

export type SampleBg = ConditionalValue<string>;

export const COLOR_THEME_IDS = [ 'light', 'dim', 'midnight', 'dark', 'system' ] as const;
export type ColorThemeId = typeof COLOR_THEME_IDS[number];

export const SYSTEM_COLOR_THEME_ID = 'system' satisfies ColorThemeId;
export type SystemColorThemeId = typeof SYSTEM_COLOR_THEME_ID;

export type ConcreteColorThemeId = Exclude<ColorThemeId, SystemColorThemeId>;

export interface ConcreteColorTheme {
  readonly id: ConcreteColorThemeId;
  readonly label: string;
  readonly colorMode: ColorMode;
  readonly hex: string;
  readonly sampleBg: SampleBg;
}

export interface SystemColorTheme {
  readonly id: SystemColorThemeId;
  readonly label: string;
  readonly colorMode: SystemColorThemeId;
  readonly sampleBg: SampleBg;
}

export type ColorTheme = ConcreteColorTheme | SystemColorTheme;

const DARK_SAMPLE_BG = 'linear-gradient(161deg, #000 9.37%, #383838 92.52%)';

export const COLOR_THEMES: Array<ColorTheme> = [
  {
    id: 'light',
    label: 'Light',
    colorMode: 'light',
    hex: '#FFFFFF',
    sampleBg: 'rgba(255, 255, 255, 1)',
  },
  {
    id: 'dim',
    label: 'Dim',
    colorMode: 'dark',
    hex: '#232B37',
    sampleBg: 'linear-gradient(152deg, #232B37 50%, rgba(255, 255, 255, 0.00) 290.71%)',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    colorMode: 'dark',
    hex: '#1B2E48',
    sampleBg: 'linear-gradient(148deg, #1B3F71 50%, rgba(255, 255, 255, 0.00) 312.35%)',
  },
  {
    id: 'dark',
    label: 'Dark',
    colorMode: 'dark',
    hex: '#101112',
    sampleBg: DARK_SAMPLE_BG,
  },
  {
    id: SYSTEM_COLOR_THEME_ID,
    label: 'Auto (System)',
    colorMode: SYSTEM_COLOR_THEME_ID,
    sampleBg: {
      _light: `linear-gradient(90deg, transparent 50%, {colors.blackAlpha.50} 50%), ${ DARK_SAMPLE_BG } left / 50% 100% no-repeat`,
      _dark: `linear-gradient(90deg, transparent 50%, {colors.whiteAlpha.900} 50%), ${ DARK_SAMPLE_BG } left / 50% 100% no-repeat`,
    },
  },
];

export function isSystemColorTheme(theme: ColorTheme): theme is SystemColorTheme {
  return theme.id === SYSTEM_COLOR_THEME_ID;
}

export function isConcreteColorTheme(theme: ColorTheme): theme is ConcreteColorTheme {
  return !isSystemColorTheme(theme);
}

export function coversBothColorModes(themes: ReadonlyArray<ColorTheme>): boolean {
  return themes.some((theme) => theme.colorMode === 'light') && themes.some((theme) => theme.colorMode === 'dark');
}
