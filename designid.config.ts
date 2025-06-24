import type { TConfigFile } from '@designid/tokens';

const $fonts = [ 100, 400, 600, 800, 900 ].reduce((acc, weight) => ([
  ...(acc ?? []),
  {
    family: '"Inter", sans-serif',
    style: 'Normal',
    faceStyle: 'normal',
    weight,
    linkHref: `https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,${ weight }&display=swap`,
    format: 'woff2',
  },
  {
    family: '"Inter", sans-serif',
    style: 'Italic',
    faceStyle: 'italic',
    weight,
    linkHref: `https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@1,14..32,${ weight }&display=swap`,
    format: 'woff2',
  },
  {
    family: '"Kode Mono", monospace',
    style: 'Normal',
    faceStyle: 'normal',
    weight,
    linkHref: `https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,${ weight }&family=Kode+Mono:wght@400..700&display=swap`,
    format: 'woff2',
  },
]), [] as TConfigFile['$fonts']);

const config: TConfigFile = {
  $name: 'Kadena Design System Tokens',
  $version: '0.0.1',
  $paths: {
    baseDir: './toolkit/theme/design-system',
    distDir: './dist',
    buildDir: './build',
    tokensDir: './tokens',
    assets: {
      icons: {
        sourceDir: '../../../icons',
      },
      fonts: {
        sourceDir: './assets/fonts',
      },
    },
  },
  $modes: {

    'default': 'light',
    dark: 'dark',
  },
  $fonts,
  $metaData: {
    tokenNamespace: 'kda',
    colorspace: 'hex',
    fontNamespace: 'font',
    tokens: {
      css: {
        mediaQuery: {
          match: '.',
          separateThemeFiles: false,
        },
        hooks: {
          shortenName: {
            enabled: true,
            prefix: [
              {
                find: 'kda-foundation-',
                replace: 'kda-',
              },
            ],
            suffix: [
              {
                find: '-default',
                replace: '',
              },
            ],
          },
        },
      },
    },
  },
};

export default config;
