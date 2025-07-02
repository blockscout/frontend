import type { ApiName } from 'lib/api/types';

import { stripTrailingSlash } from 'toolkit/utils/url';

import { getEnvValue } from './utils';

export interface ApiPropsBase {
  endpoint: string;
  basePath?: string;
}

export interface ApiPropsFull extends ApiPropsBase {
  host: string;
  protocol: string;
  port?: string;
  socketEndpoint: string;
}

const generalApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_API_HOST');
  const apiSchema = getEnvValue('NEXT_PUBLIC_API_PROTOCOL') || 'https';
  const apiPort = getEnvValue('NEXT_PUBLIC_API_PORT');
  const apiEndpoint = [
    apiSchema || 'https',
    '://',
    apiHost,
    apiPort && ':' + apiPort,
  ].filter(Boolean).join('');

  const socketSchema = getEnvValue('NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL') || 'wss';
  const socketEndpoint = [
    socketSchema,
    '://',
    apiHost,
    apiPort && ':' + apiPort,
  ].filter(Boolean).join('');

  return Object.freeze({
    endpoint: apiEndpoint,
    basePath: stripTrailingSlash(getEnvValue('NEXT_PUBLIC_API_BASE_PATH') || ''),
    socketEndpoint: socketEndpoint,
    host: apiHost ?? '',
    protocol: apiSchema ?? 'https',
    port: apiPort,
  });
})();

const adminApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_ADMIN_SERVICE_API_HOST');
  if (!apiHost) {
    return;
  }

  return Object.freeze({
    endpoint: apiHost,
  });
})();

const bensApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_NAME_SERVICE_API_HOST');
  if (!apiHost) {
    return;
  }

  return Object.freeze({
    endpoint: apiHost,
  });
})();

const contractInfoApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_CONTRACT_INFO_API_HOST');
  if (!apiHost) {
    return;
  }

  return Object.freeze({
    endpoint: apiHost,
  });
})();

const metadataApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_METADATA_SERVICE_API_HOST');
  if (!apiHost) {
    return;
  }

  return Object.freeze({
    endpoint: apiHost,
  });
})();

const rewardsApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_REWARDS_SERVICE_API_HOST');
  if (!apiHost) {
    return;
  }

  return Object.freeze({
    endpoint: apiHost,
  });
})();

const statsApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_STATS_API_HOST');
  if (!apiHost) {
    return;
  }

  return Object.freeze({
    endpoint: apiHost,
    basePath: stripTrailingSlash(getEnvValue('NEXT_PUBLIC_STATS_API_BASE_PATH') || ''),
  });
})();

const tacApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST');
  if (!apiHost) {
    return;
  }

  return Object.freeze({
    endpoint: apiHost,
  });
})();

const visualizeApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_VISUALIZE_API_HOST');
  if (!apiHost) {
    return;
  }

  return Object.freeze({
    endpoint: apiHost,
    basePath: stripTrailingSlash(getEnvValue('NEXT_PUBLIC_VISUALIZE_API_BASE_PATH') || ''),
  });
})();

type Apis = {
  general: ApiPropsFull;
} & Partial<Record<Exclude<ApiName, 'general'>, ApiPropsBase>>;

const apis: Apis = Object.freeze({
  general: generalApi,
  admin: adminApi,
  bens: bensApi,
  contractInfo: contractInfoApi,
  metadata: metadataApi,
  rewards: rewardsApi,
  stats: statsApi,
  tac: tacApi,
  visualize: visualizeApi,
});

export default apis;
