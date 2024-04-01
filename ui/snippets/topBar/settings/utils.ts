import type { IdenticonType } from 'types/views/address';

export const COLOR_THEMES = [
  {
    label: 'Light',
    colorMode: 'light',
    hex: '#FFFFFF',
    sampleBg: 'linear-gradient(154deg, #EFEFEF 50%, rgba(255, 255, 255, 0.00) 330.86%)',
  },
  {
    label: 'Dim',
    colorMode: 'dark',
    hex: '#232B37',
    sampleBg: 'linear-gradient(152deg, #232B37 50%, rgba(255, 255, 255, 0.00) 290.71%)',
  },
  {
    label: 'Midnight',
    colorMode: 'dark',
    hex: '#1B2E48',
    sampleBg: 'linear-gradient(148deg, #1B3F71 50%, rgba(255, 255, 255, 0.00) 312.35%)',
  },
  {
    label: 'Dark',
    colorMode: 'dark',
    hex: '#101112',
    sampleBg: 'linear-gradient(161deg, #000 9.37%, #383838 92.52%)',
  },
];

export type ColorTheme = typeof COLOR_THEMES[number];

export const IDENTICONS: Array<{ label: string; id: IdenticonType; sampleBg: string }> = [
  {
    label: 'GitHub',
    id: 'github',
    sampleBg: 'url("/static/identicon_logos/github.png") center / contain no-repeat',
  },
  {
    label: 'Metamask jazzicon',
    id: 'jazzicon',
    sampleBg: 'url("/static/identicon_logos/jazzicon.png") center / contain no-repeat',
  },
  {
    label: 'Ethereum blockies',
    id: 'blockie',
    sampleBg: 'url("/static/identicon_logos/blockies.png") center / contain no-repeat',
  },
  {
    label: 'Gradient avatar',
    id: 'gradient_avatar',
    sampleBg: 'url("/static/identicon_logos/gradient_avatar.png") center / contain no-repeat',
  },
];
