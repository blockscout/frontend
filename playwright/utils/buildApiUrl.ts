import { compile } from 'path-to-regexp';

import config from 'configs/app';
import type { ResourceName, ResourcePathParams } from 'lib/api/resources';
import { RESOURCES } from 'lib/api/resources';

export default function buildApiUrl<R extends ResourceName>(resourceName: R, pathParams?: ResourcePathParams<R>) {
  const resource = RESOURCES[resourceName];
  const origin = 'endpoint' in resource && resource.endpoint ? resource.endpoint + (resource.basePath ?? '') : config.api.endpoint;
  return origin + compile(resource.path)(pathParams);
}
