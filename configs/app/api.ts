import stripTrailingSlash from 'lib/stripTrailingSlash';

import { getEnvValue } from './utils';

// TODO @tom2drum make API HOST required and remove fallback to blockscout
// TODO @tom2drum strip trailing slashes
const apiHost = getEnvValue(process.env.NEXT_PUBLIC_API_HOST);
const apiSchema = getEnvValue(process.env.NEXT_PUBLIC_API_PROTOCOL) || 'https';
const apiPort = getEnvValue(process.env.NEXT_PUBLIC_API_PORT);
const apiEndpoint = apiHost ? [
  apiSchema || 'https',
  '://',
  apiHost,
  apiPort && ':' + apiPort,
].filter(Boolean).join('') : 'https://blockscout.com';
const socketSchema = getEnvValue(process.env.NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL) || 'wss';

const api = Object.freeze({
  host: apiHost,
  endpoint: apiEndpoint,
  socket: apiHost ? `${ socketSchema }://${ apiHost }` : 'wss://blockscout.com',
  basePath: stripTrailingSlash(getEnvValue(process.env.NEXT_PUBLIC_API_BASE_PATH) || ''),
});

export default api;
