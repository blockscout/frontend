import type { ColorThemeId } from 'types/settings';

import type { ColorMode } from 'toolkit/chakra/color-mode';

export interface ColorTheme {
  id: ColorThemeId;
  label: string;
  colorMode: ColorMode;
  hex: string;
  sampleBg: string;
}

export const COLOR_THEMES: Array<ColorTheme> = [
  {
    id: 'light',
    label: 'Light',
    colorMode: 'light',
    hex: '#FFFFFF',
    sampleBg: 'linear-gradient(154deg, #EFEFEF 50%, rgba(255, 255, 255, 0.00) 330.86%)',
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
    sampleBg: 'linear-gradient(161deg, #000 9.37%, #383838 92.52%)',
  },
];
