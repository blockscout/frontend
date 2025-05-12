import type { SwaggerRequest } from './types';

import config from 'configs/app';

const feature = config.features.apiDocs;

export const REST_API_SECTIONS = [
  feature.isEnabled && {
    id: 'blockscout-core-api',
    title: 'Blockscout core API',
    swagger: {
      url: feature.coreApiSwaggerUrl,
      requestInterceptor: (req: SwaggerRequest) => {
        const DEFAULT_SERVER = 'blockscout.com/poa/core';

        if (!req.loadSpec) {
          const newUrl = new URL(req.url.replace(DEFAULT_SERVER, config.apis.general.host));

          newUrl.protocol = config.apis.general.protocol + ':';

          if (config.apis.general.port) {
            newUrl.port = config.apis.general.port;
          }

          req.url = newUrl.toString();
        }
        return req;
      },
    },
  },
  config.apis.stats && {
    id: 'stats-api',
    title: 'Stats API',
    swagger: {
      url: `${ config.apis.stats.endpoint }${ config.apis.stats.basePath }/api/v1/docs/swagger.yaml`,
      requestInterceptor: (req: SwaggerRequest) => {
        try {
          const url = new URL(req.url);
          if (config.apis.stats?.basePath && !url.pathname.includes(config.apis.stats.basePath)) {
            url.pathname = (config.apis.stats?.basePath ?? '') + url.pathname;
          }
          req.url = url.toString();
        } catch (error) {}
        return req;
      },
    },
  },
].filter(Boolean);
