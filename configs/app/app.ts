import { getEnvValue } from './utils';

const appPort = getEnvValue('NEXT_PUBLIC_APP_PORT');
const appSchema = getEnvValue('NEXT_PUBLIC_APP_PROTOCOL');
const appHost = getEnvValue('NEXT_PUBLIC_APP_HOST');
const baseUrl = [
  appSchema || 'https',
  '://',
  appHost,
  appPort && ':' + appPort,
].filter(Boolean).join('');
const isDev = getEnvValue('NEXT_PUBLIC_APP_ENV') === 'development';
const isPw = getEnvValue('NEXT_PUBLIC_APP_INSTANCE') === 'pw';
const spriteHash = getEnvValue('NEXT_PUBLIC_ICON_SPRITE_HASH');

const app = Object.freeze({
  isDev,
  isPw,
  protocol: appSchema,
  host: appHost,
  port: appPort,
  baseUrl,
  useProxy: getEnvValue('NEXT_PUBLIC_USE_NEXT_JS_PROXY') === 'true',
  spriteHash,
});

export default app;
