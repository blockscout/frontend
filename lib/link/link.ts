import { compile } from 'path-to-regexp';

import { ROUTES } from './routes';
import type { RouteName } from './routes';

export function link(routeName: RouteName, urlParams?: Record<string, string | undefined>, queryParams?: Record<string, string>): string {
  const route = ROUTES[routeName];
  if (!route) {
    return '';
  }

  const toPath = compile(route.pattern, { encode: encodeURIComponent, validate: false });
  const path = toPath(urlParams);
  const url = new URL(path, window.location.origin);

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
}
