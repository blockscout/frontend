import { compile } from 'path-to-regexp';

import type { ResourceName } from 'lib/api/resources';
import { RESOURCES } from 'lib/api/resources';

export default function buildApiUrl(resourceName: ResourceName, pathParams?: Record<string, string>) {
  const resource = RESOURCES[resourceName];
  return compile('/proxy/poa/core' + resource.path)(pathParams);
}
