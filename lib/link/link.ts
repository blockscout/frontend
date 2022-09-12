import isBrowser from 'lib/isBrowser';

import { ROUTES } from './routes';
import type { RouteName } from './routes';

const PATH_PARAM_REGEXP = /\/\[(\w+)\]/g;

export function link(routeName: RouteName, urlParams?: Record<string, string | undefined>, queryParams?: Record<string, string>): string {
  const route = ROUTES[routeName];
  if (!route) {
    return '';
  }

  const path = route.pattern.replace(PATH_PARAM_REGEXP, (_, paramName: string) => {
    const paramValue = urlParams?.[paramName];
    return paramValue ? `/${ paramValue }` : '';
  });

  const url = new URL(path, isBrowser() ? window.location.origin : 'https://blockscout.com');

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
}
