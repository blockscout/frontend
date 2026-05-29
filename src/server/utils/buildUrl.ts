// SPDX-License-Identifier: LicenseRef-Blockscout

import { compile } from 'path-to-regexp';

import type { ResourceName } from 'src/api/resources';
import getResourceParams from 'src/api/utils/get-resource-params';

export default function buildUrl(
  _resource: ResourceName,
  pathParams?: Record<string, string | undefined>,
  queryParams?: Record<string, string | number | undefined>,
) {
  const { resource, api } = getResourceParams(_resource);
  const baseUrl = api.endpoint;
  const basePath = api.basePath ?? '';
  const path = basePath + resource.path;
  const url = new URL(compile(path)(pathParams), baseUrl);

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    value && url.searchParams.append(key, String(value));
  });

  return url.toString();
}
