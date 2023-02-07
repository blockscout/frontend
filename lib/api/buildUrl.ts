import { compile } from 'path-to-regexp';

import appConfig from 'configs/app/config';

import isNeedProxy from './isNeedProxy';
import { RESOURCES } from './resources';
import type { ApiResource, ResourceName } from './resources';

export default function buildUrl(
  _resource: ApiResource | ResourceName,
  pathParams?: Record<string, string | undefined>,
  queryParams?: Record<string, string | Array<string> | number | undefined>,
) {
  const resource: ApiResource = typeof _resource === 'string' ? RESOURCES[_resource] : _resource;
  const baseUrl = isNeedProxy() ? appConfig.baseUrl : (resource.endpoint || appConfig.api.endpoint);
  const basePath = resource.basePath !== undefined ? resource.basePath : appConfig.api.basePath;
  const path = isNeedProxy() ? '/node-api/proxy' + basePath + resource.path : basePath + resource.path;
  const url = new URL(compile(path)(pathParams), baseUrl);

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    value && url.searchParams.append(key, String(value));
  });

  return url.toString();
}
