import { compile } from 'path-to-regexp';

import appConfig from 'configs/app/config';

import type { ApiResource } from './resources';

export default function buildUrl(
  resource: ApiResource,
  pathParams?: Record<string, string>,
  queryParams?: Record<string, string | undefined>,
) {
  // FIXME
  // 1. I was not able to figure out how to send CORS with credentials from localhost
  //    unsuccessfully tried different ways, even custom local dev domain
  //    so for local development we have to use next.js api as proxy server
  // 2. and there is an issue with API and csrf token
  //    for some reason API will reply with error "Bad request" to any PUT / POST CORS request
  //    even though valid csrf-token is passed in header
  //    we also can pass token in request body but in this case API will replay with "Forbidden" error
  //    @nikitosing said it will take a lot of time to debug this problem on back-end side, maybe he'll change his mind in future :)
  // To sum up, we are using next.js proxy for all instances where app host is not the same as API host (incl. localhost)
  // will need to change the condition if there are more micro services that need authentication and DB state changes
  const needProxy = appConfig.host !== appConfig.api.host;

  const baseUrl = needProxy ? appConfig.baseUrl : (resource.endpoint || appConfig.api.endpoint);
  const basePath = resource.basePath !== undefined ? resource.basePath : appConfig.api.basePath;
  const path = needProxy ? '/proxy' + basePath + resource.path : basePath + resource.path;
  const url = new URL(compile(path)(pathParams), baseUrl);

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    value && url.searchParams.append(key, value);
  });

  return url.toString();
}
