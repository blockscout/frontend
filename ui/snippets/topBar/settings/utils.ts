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
    colors: [
      { hex: '#232B37', sampleBg: 'linear-gradient(152deg, #232B37 50%, rgba(255, 255, 255, 0.00) 290.71%)' },
      { hex: '#1B2E48', sampleBg: 'linear-gradient(150deg, #1B2E48 50%, rgba(255, 255, 255, 0.00) 312.75%)' },
    ],
  },
  {
    label: 'Midnight',
    colorMode: 'dark',
    hex: '#1B2E48',
    sampleBg: 'linear-gradient(150deg, #1B2E48 50%, rgba(255, 255, 255, 0.00) 312.75%)',
  },
  {
    label: 'Dark',
    colorMode: 'dark',
    hex: '#101112',
    sampleBg: 'linear-gradient(161deg, #000 9.37%, #383838 92.52%)',
  },
];

export type ColorTheme = typeof COLOR_THEMES[number];
