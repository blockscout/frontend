import { compile } from 'path-to-regexp';

import type { ResourceName, ResourcePathParams } from 'lib/api/resources';
import { RESOURCES } from 'lib/api/resources';

export default function buildApiUrl<R extends ResourceName>(resourceName: R, pathParams?: ResourcePathParams<R>) {
  const resource = RESOURCES[resourceName];
  const defaultApi = 'https://' + process.env.NEXT_PUBLIC_API_HOST + ':' + process.env.NEXT_PUBLIC_API_PORT;
  const origin = 'endpoint' in resource && resource.endpoint ? resource.endpoint + (resource.basePath ?? '') : defaultApi;
  return origin + compile(resource.path)(pathParams);
}
