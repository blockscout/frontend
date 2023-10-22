import { getEnvValue } from './utils';

const appPort = getEnvValue(process.env.NEXT_PUBLIC_APP_PORT);
const appSchema = getEnvValue(process.env.NEXT_PUBLIC_APP_PROTOCOL);
const appHost = getEnvValue(process.env.NEXT_PUBLIC_APP_HOST);
const appBasePath = getEnvValue(process.env.NEXT_PUBLIC_APP_BASE_PATH) || '';

const baseUrl = [
  appSchema || 'https',
  '://',
  appHost,
  appPort && ':' + appPort + appBasePath,
].filter(Boolean).join('');
const isDev = process.env.NODE_ENV === 'development';

const app = Object.freeze({
  isDev,
  protocol: appSchema,
  host: appHost,
  port: appPort,
  baseUrl,
  useProxy: getEnvValue(process.env.NEXT_PUBLIC_USE_NEXT_JS_PROXY) === 'true',
});

export default app;
