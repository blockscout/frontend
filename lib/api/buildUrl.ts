import { compile } from 'path-to-regexp';

import appConfig from 'configs/app/config';

import type { ApiResource } from './resources';

export default function buildUrl(
  resource: ApiResource,
  pathParams?: Record<string, string>,
  queryParams?: Record<string, string | undefined>,
) {
  // FIXME was not able to figure out how to send CORS with credentials from localhost
  // so for local development we use nextjs api as proxy server (only!)
  const baseUrl = appConfig.host === 'localhost' ? appConfig.baseUrl : (resource.endpoint || appConfig.api.endpoint);
  const basePath = resource.basePath !== undefined ? resource.basePath : appConfig.api.basePath;
  const path = appConfig.host === 'localhost' ?
    '/proxy' + basePath + resource.path :
    basePath + resource.path;
  const url = new URL(compile(path)(pathParams), baseUrl);

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    value && url.searchParams.append(key, value);
  });

  return url.toString();
}
