// SPDX-License-Identifier: LicenseRef-Blockscout

const HTTP_METHODS = [ 'get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace' ] as const;

interface OpenApiOperation {
  tags?: Array<string>;
  summary?: string;
}

interface OpenApiPathItem {
  [method: string]: OpenApiOperation | undefined;
}

export interface OpenApiSpecWithPaths {
  paths?: Record<string, OpenApiPathItem>;
  openapi?: string;
}

export function keepFirstTagOnly<T extends OpenApiSpecWithPaths>(spec: T): T {
  if (!spec.paths) {
    return spec;
  }

  const paths = { ...spec.paths };

  for (const pathKey of Object.keys(paths)) {
    const pathItem = { ...paths[pathKey] };

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (operation?.tags && operation.tags.length > 1) {
        pathItem[method] = { ...operation, tags: [ operation.tags[0] ] };
      }
    }

    paths[pathKey] = pathItem;
  }

  return { ...spec, paths };
}
