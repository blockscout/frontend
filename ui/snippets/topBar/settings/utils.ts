import type { IdenticonType } from 'types/views/address';

export const COLOR_THEMES = [
  {
    label: 'Light',
    colorMode: 'light',
    hex: '#FFFFFF',
    sampleBg: 'white',
  },
  {
    label: 'Dark',
    colorMode: 'dark',
    hex: '#101112',
    sampleBg: 'rgba(35, 35, 35, 1)',
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
