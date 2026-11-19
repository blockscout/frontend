// SPDX-License-Identifier: LicenseRef-Blockscout

import type { SwaggerRequest } from '../types/client';
import type { ApiPropsBase } from 'src/api/types';

import config from 'src/config';

const microserviceRequestInterceptorFactory = (api: ApiPropsBase) => (req: SwaggerRequest) => {
  try {
    const url = new URL(req.url);
    if (api?.basePath && !url.pathname.includes(api.basePath)) {
      url.pathname = (api?.basePath ?? '') + url.pathname;
    }
    req.url = url.toString();
  } catch (error) {}
  return req;
};

const getMicroserviceSwaggerUrl = (api: ApiPropsBase) => `${ api.endpoint }${ api.basePath ?? '' }/api/v1/docs/swagger.yaml`;

export const REST_API_SECTIONS = [
  config.apis.core && {
    id: 'blockscout-core-api',
    title: 'Blockscout core API',
    swagger: {
      // default swagger URL, will be replaced with an URL constructed from the backend version and the openapi spec folder name
      url: 'https://raw.githubusercontent.com/blockscout/blockscout-api-v2-swagger/main/swagger.yaml',
    },
  },
  config.apis.stats && {
    id: 'stats-api',
    title: 'Stats API',
    swagger: {
      url: getMicroserviceSwaggerUrl(config.apis.stats),
      requestInterceptor: microserviceRequestInterceptorFactory(config.apis.stats),
    },
  },
  config.apis.bens && {
    id: 'bens-api',
    title: 'Name service API',
    swagger: {
      url: getMicroserviceSwaggerUrl(config.apis.bens),
      requestInterceptor: microserviceRequestInterceptorFactory(config.apis.bens),
    },
  },
  config.apis.userOps && {
    id: 'user-ops-api',
    title: 'User ops indexer API',
    swagger: {
      url: getMicroserviceSwaggerUrl(config.apis.userOps),
      requestInterceptor: microserviceRequestInterceptorFactory(config.apis.userOps),
    },
  },
  config.apis.tac && {
    id: 'tac-api',
    title: 'TAC operation lifecycle API',
    swagger: {
      url: getMicroserviceSwaggerUrl(config.apis.tac),
      requestInterceptor: microserviceRequestInterceptorFactory(config.apis.tac),
    },
  },
  config.apis.zetachain && {
    id: 'zetachain-api',
    title: 'Zetachain CCTX API',
    swagger: {
      url: getMicroserviceSwaggerUrl(config.apis.zetachain),
      requestInterceptor: microserviceRequestInterceptorFactory(config.apis.zetachain),
    },
  },
  config.apis.interchainIndexer && {
    id: 'interchain-indexer-api',
    title: 'Interchain indexer API',
    swagger: {
      url: getMicroserviceSwaggerUrl(config.apis.interchainIndexer),
      requestInterceptor: microserviceRequestInterceptorFactory(config.apis.interchainIndexer),
    },
  },
  config.apis.multichainStats && {
    id: 'multichain-stats-api',
    title: 'Multichain stats API',
    swagger: {
      url: getMicroserviceSwaggerUrl(config.apis.multichainStats),
      requestInterceptor: microserviceRequestInterceptorFactory(config.apis.multichainStats),
    },
  },
].filter(Boolean);
