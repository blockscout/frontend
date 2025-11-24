import { compile } from 'path-to-regexp';

import config from 'configs/app';

import isNeedProxy from './isNeedProxy';
import { RESOURCES } from './resources';
import type { ApiResource, ResourceName, ResourcePathParams } from './resources';

export default function buildUrl<R extends ResourceName>(
  resourceName: R,
  pathParams?: ResourcePathParams<R>,
  queryParams?: Record<string, string | Array<string> | number | boolean | null | undefined>,
  noProxy?: boolean,
): string {
  const resource: ApiResource = RESOURCES[resourceName];
  const baseUrl = !noProxy && isNeedProxy() ? config.app.baseUrl : (resource.endpoint || config.api.endpoint);
  const basePath = resource.basePath !== undefined ? resource.basePath : config.api.basePath;
  const path = !noProxy && isNeedProxy() ? '/node-api/proxy' + basePath + resource.path : basePath + resource.path;
  const compiledPath = compile(path)(pathParams);
  
  // Use relative URL if baseUrl is empty (same origin)
  // In browser, use window.location.origin; in SSR, use a placeholder that will be resolved by browser
  let url: URL;
  if (baseUrl) {
    url = new URL(compiledPath, baseUrl);
  } else if (typeof window !== 'undefined') {
    url = new URL(compiledPath, window.location.origin);
  } else {
    // SSR: use a placeholder origin, browser will resolve to current origin
    url = new URL(compiledPath, 'http://placeholder');
  }

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    // there are some pagination params that can be null or false for the next page
    value !== undefined && value !== '' && url.searchParams.append(key, String(value));
  });

  // Return relative path if baseUrl was empty (remove http://placeholder)
  if (!baseUrl && typeof window === 'undefined') {
    return url.pathname + url.search;
  }

  return url.toString();
}
