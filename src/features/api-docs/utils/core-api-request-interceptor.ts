// SPDX-License-Identifier: LicenseRef-Blockscout

import type { SwaggerRequest } from '../types/client';
import type { ApiPropsFull } from 'src/api/types';

type CoreApiLocation = Readonly<Pick<ApiPropsFull, 'endpoint' | 'host' | 'protocol' | 'port' | 'basePath'>>;

const LEGACY_PLACEHOLDER_SERVER = 'blockscout.com/poa/core';
const PLACEHOLDER_SERVER = 'http://localhost';
const PLACEHOLDER_SERVER_WITH_API_PREFIX = `${ PLACEHOLDER_SERVER }/api`;

const parseUrl = (url: string): URL | undefined => {
  try {
    return new URL(url);
  } catch {
    return undefined;
  }
};

const rewriteLegacyPlaceholderUrl = (url: string, coreApi: CoreApiLocation): string | undefined => {
  const rewrittenUrl = parseUrl(url.replace(LEGACY_PLACEHOLDER_SERVER, coreApi.host));
  if (!rewrittenUrl) {
    return undefined;
  }

  rewrittenUrl.protocol = coreApi.protocol;

  if (coreApi.port) {
    rewrittenUrl.port = coreApi.port;
  }

  if (coreApi.basePath && !rewrittenUrl.pathname.includes(coreApi.basePath)) {
    rewrittenUrl.pathname = `${ coreApi.basePath }${ rewrittenUrl.pathname }`;
  }

  return rewrittenUrl.toString();
};

const rewritePlaceholderUrl = (url: string, coreApi: CoreApiLocation): string | undefined => {
  const coreApiRoot = `${ coreApi.endpoint }${ coreApi.basePath ?? '' }`;
  const rewrittenUrl = url.includes(PLACEHOLDER_SERVER_WITH_API_PREFIX) ?
    url.replace(PLACEHOLDER_SERVER_WITH_API_PREFIX, `${ coreApiRoot }/api`) :
    url.replace(PLACEHOLDER_SERVER, coreApiRoot);

  return parseUrl(rewrittenUrl)?.toString();
};

const rewriteUrl = (url: string, coreApi: CoreApiLocation): string | undefined => {
  if (url.includes(LEGACY_PLACEHOLDER_SERVER)) {
    return rewriteLegacyPlaceholderUrl(url, coreApi);
  }

  if (url.includes(PLACEHOLDER_SERVER)) {
    return rewritePlaceholderUrl(url, coreApi);
  }

  return undefined;
};

export const createCoreApiRequestInterceptor = (coreApi: CoreApiLocation): ((req: SwaggerRequest) => SwaggerRequest) => {
  return (req) => {
    if (req.loadSpec || typeof req.url !== 'string') {
      return req;
    }

    const rewrittenUrl = rewriteUrl(req.url, coreApi);
    if (rewrittenUrl !== undefined) {
      req.url = rewrittenUrl;
    }

    return req;
  };
};
