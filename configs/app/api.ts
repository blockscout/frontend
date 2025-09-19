import stripTrailingSlash from 'lib/stripTrailingSlash';

import { getApiHost, getEnvValue, getStatsApiHost } from './utils';

const apiHost = getApiHost();
const apiSchema = getEnvValue('NEXT_PUBLIC_API_PROTOCOL') || 'https';
const apiPort = getEnvValue('NEXT_PUBLIC_API_PORT');
const apiEndpoint = getStatsApiHost();

const socketSchema = getEnvValue('NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL') || 'wss';
const socketEndpoint = [
  socketSchema,
  '://',
  apiHost,
  apiPort && ':' + apiPort,
].filter(Boolean).join('');

const api = Object.freeze({
  host: apiHost,
  protocol: apiSchema,
  port: apiPort,
  endpoint: apiEndpoint,
  socket: socketEndpoint,
  basePath: stripTrailingSlash(getEnvValue('NEXT_PUBLIC_API_BASE_PATH') || ''),
});

export default api;
