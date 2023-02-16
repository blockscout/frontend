import { compile } from 'path-to-regexp';

import type { ResourceName, ResourcePathParams } from 'lib/api/resources';
import { RESOURCES } from 'lib/api/resources';

export default function buildApiUrl<R extends ResourceName>(resourceName: R, pathParams?: ResourcePathParams<R>) {
  const resource = RESOURCES[resourceName];
  return compile('/node-api/proxy/poa/core' + resource.path)(pathParams);
}
