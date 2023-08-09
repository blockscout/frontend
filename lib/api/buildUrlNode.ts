import { compile } from 'path-to-regexp';

import config from 'configs/app';

import { RESOURCES } from './resources';
import type { ApiResource, ResourceName } from './resources';

export default function buildUrlNode(
  _resource: ApiResource | ResourceName,
  pathParams?: Record<string, string | undefined>,
  queryParams?: Record<string, string | number | undefined>,
) {
  const resource: ApiResource = typeof _resource === 'string' ? RESOURCES[_resource] : _resource;
  const baseUrl = resource.endpoint || config.api.endpoint;
  const basePath = resource.basePath !== undefined ? resource.basePath : config.api.basePath;
  const path = basePath + resource.path;
  const url = new URL(compile(path)(pathParams), baseUrl);

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    value && url.searchParams.append(key, String(value));
  });

  return url.toString();
}
