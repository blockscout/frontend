import { getEnvValue } from './utils';

const appPort = getEnvValue(process.env.NEXT_PUBLIC_APP_PORT);
const appSchema = getEnvValue(process.env.NEXT_PUBLIC_APP_PROTOCOL);
const appHost = getEnvValue(process.env.NEXT_PUBLIC_APP_HOST);
const baseUrl = [
  appSchema || 'https',
  '://',
  appHost,
  appPort && ':' + appPort,
].filter(Boolean).join('');
const isDev = process.env.NODE_ENV === 'development';

const app = Object.freeze({
  isDev,
  protocol: 'http',
  host: '172.16.13.130',
  port: '4000',
  baseUrl: 'http://172.16.13.130:4000',
  useProxy: true,
});

// const app = Object.freeze({
//   isDev: false,
//   protocol: 'http',
//   port: '4000',
//   host: '172.16.13.130',
//   baseUrl: 'http://172.16.13.130:4000',
//   useProxy: true,
// });

export default app;
