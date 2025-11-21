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
  // Use relative URL if baseUrl is empty (same origin)
  const url = baseUrl ? new URL(compile(path)(pathParams), baseUrl) : new URL(compile(path)(pathParams), typeof window !== 'undefined' ? window.location.origin : 'http://localhost');

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    // there are some pagination params that can be null or false for the next page
    value !== undefined && value !== '' && url.searchParams.append(key, String(value));
  });

  return url.toString();
}
