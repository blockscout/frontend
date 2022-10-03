const env = process.env.VERCEL_ENV || process.env.NODE_ENV;
const isDev = env === 'development';

const config = Object.freeze({
  env,
  isDev,
  network: {
    type: process.env.NEXT_PUBLIC_NETWORK_TYPE,
    subtype: process.env.NEXT_PUBLIC_NETWORK_SUBTYPE,
    logo: process.env.NEXT_PUBLIC_NETWORK_LOGO,
    name: process.env.NEXT_PUBLIC_NETWORK_NAME,
    id: process.env.NEXT_PUBLIC_NETWORK_ID,
    shortName: process.env.NEXT_PUBLIC_NETWORK_SHORT_NAME,
    currency: process.env.NEXT_PUBLIC_NETWORK_CURRENCY,
    assetsPathname: process.env.NEXT_PUBLIC_NETWORK_ASSETS_PATHNAME,
    nativeTokenAddress: process.env.NEXT_PUBLIC_NETWORK_TOKEN_ADDRESS,
    basePath: '/' + [ process.env.NEXT_PUBLIC_NETWORK_TYPE, process.env.NEXT_PUBLIC_NETWORK_SUBTYPE ].filter(Boolean).join('/'),
  },
  isAccountSupported: process.env.NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED?.replaceAll('\'', '"') === 'true',
  protocol: process.env.NEXT_PUBLIC_APP_PROTOCOL,
  host: process.env.NEXT_PUBLIC_APP_HOST,
  port: process.env.NEXT_PUBLIC_APP_PORT,
  baseUrl: [
    process.env.NEXT_PUBLIC_APP_PROTOCOL || 'https',
    '://',
    process.env.NEXT_PUBLIC_APP_HOST,
    process.env.NEXT_PUBLIC_APP_PORT ? ':' + process.env.NEXT_PUBLIC_APP_PORT : '',
  ].join(''),
});

export default config;
