// import { getEnvValue } from './utils';

// const apiHost = getEnvValue(process.env.NEXT_PUBLIC_API_HOST);
// const apiSchema = getEnvValue(process.env.NEXT_PUBLIC_API_PROTOCOL) || 'https';
// const apiPort = getEnvValue(process.env.NEXT_PUBLIC_API_PORT);
// const apiEndpoint = [
//   apiSchema || 'https',
//   '://',
//   apiHost,
//   apiPort && ':' + apiPort,
// ].filter(Boolean).join('');

// const socketSchema = getEnvValue(process.env.NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL) || 'wss';
// const socketEndpoint = [
//   socketSchema,
//   '://',
//   apiHost,
//   apiPort && ':' + apiPort,
// ].filter(Boolean).join('');

// const api = Object.freeze({
//   host: apiHost,
//   endpoint: apiEndpoint,
//   socket: socketEndpoint,
//   basePath: stripTrailingSlash(getEnvValue(process.env.NEXT_PUBLIC_API_BASE_PATH) || ''),
// });

const api = Object.freeze({
  host: 'eth.blockscout.com',
  endpoint: 'https://eth.blockscout.com',
  socket: 'ws://192.168.0.208:9091',
  basePath: '',
});

export default api;
