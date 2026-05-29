// SPDX-License-Identifier: LicenseRef-Blockscout

import { pickBy } from 'es-toolkit';

import type { ApiName } from 'src/api/types';
import { STATS_API_RESOURCES_REFETCH_INTERVAL } from 'src/features/chain-stats/types/config';
import type { StatsApiResourceNameRefetchInterval } from 'src/features/chain-stats/types/config';

import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';

import { stripTrailingSlash } from 'src/toolkit/utils/url';

import type { ResourceName } from './resources';

export interface ApiPropsBase {
  endpoint: string;
  basePath?: string;
  socketEndpoint?: string;
  instanceId?: string;
  refetchInterval?: Partial<Record<ResourceName, number>>;
}

export interface ApiPropsFull extends ApiPropsBase {
  host: string;
  protocol: string;
  port?: string;
  socketEndpoint: string;
}

const coreApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_API_HOST');
  if (!apiHost) {
    return;
  }

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
    instanceId: getEnvValue('NEXT_PUBLIC_ADMIN_RS_INSTANCE_ID') || getEnvValue('NEXT_PUBLIC_NETWORK_ID'),
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
    instanceId: getEnvValue('NEXT_PUBLIC_CONTRACT_INFO_INSTANCE_ID') || getEnvValue('NEXT_PUBLIC_NETWORK_ID'),
  });
})();

const interchainIndexerApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST');
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

const multichainAggregatorApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST');
  const cluster = getEnvValue('NEXT_PUBLIC_MULTICHAIN_CLUSTER');
  if (!apiHost || !cluster) {
    return;
  }

  try {
    const url = new URL(apiHost);

    return Object.freeze({
      endpoint: apiHost,
      socketEndpoint: `wss://${ url.host }`,
      basePath: `/api/v1/clusters/${ cluster }`,
    });
  } catch (error) {
    return;
  }
})();

const multichainStatsApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_MULTICHAIN_STATS_API_HOST');
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

  const refetchInterval = (() => {
    const refetchInterval = parseEnvJson<Record<StatsApiResourceNameRefetchInterval, number>>(getEnvValue('NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL'));

    if (refetchInterval) {
      return pickBy(refetchInterval, (value, key) => STATS_API_RESOURCES_REFETCH_INTERVAL.includes(key) && typeof value === 'number');
    }
  })();

  return Object.freeze({
    endpoint: apiHost,
    basePath: stripTrailingSlash(getEnvValue('NEXT_PUBLIC_STATS_API_BASE_PATH') || ''),
    refetchInterval,
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

const userOpsApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_USER_OPS_INDEXER_API_HOST');
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

const clustersApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_CLUSTERS_API_HOST');
  if (!apiHost) {
    return;
  }

  return Object.freeze({
    endpoint: apiHost,
  });
})();

const zetachainApi = (() => {
  const apiHost = getEnvValue('NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST');
  if (!apiHost) {
    return;
  }

  try {
    const url = new URL(apiHost);

    return Object.freeze({
      endpoint: apiHost,
      socketEndpoint: `wss://${ url.host }/socket`,
    });
  } catch (error) {
    return;
  }
})();

export type Apis = {
  core: ApiPropsFull | undefined;
} & Partial<Record<Exclude<ApiName, 'core'>, ApiPropsBase>>;

const apis: Apis = Object.freeze({
  core: coreApi,
  admin: adminApi,
  bens: bensApi,
  clusters: clustersApi,
  contractInfo: contractInfoApi,
  interchainIndexer: interchainIndexerApi,
  metadata: metadataApi,
  multichainAggregator: multichainAggregatorApi,
  multichainStats: multichainStatsApi,
  rewards: rewardsApi,
  stats: statsApi,
  tac: tacApi,
  userOps: userOpsApi,
  visualize: visualizeApi,
  zetachain: zetachainApi,
});

export default apis;
