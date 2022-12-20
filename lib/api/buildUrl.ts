import { compile } from 'path-to-regexp';

import appConfig from 'configs/app/config';

import { RESOURCES } from './resources';

export default function buildUrl(
  resource: keyof typeof RESOURCES,
  pathParams?: Record<string, string>,
  queryParams?: Record<string, string>,
) {
  // FIXME was not able to figure out how to send CORS with credentials from localhost
  // so for local development we use nextjs api as proxy server (only!)
  const base = appConfig.host === 'localhost' ? appConfig.baseUrl : appConfig.api.endpoint;
  const path = appConfig.host === 'localhost' ?
    '/proxy' + appConfig.api.basePath + RESOURCES[resource].path :
    appConfig.api.basePath + RESOURCES[resource].path;
  const url = new URL(compile(path)(pathParams), base);

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
}
