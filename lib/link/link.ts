import appConfig from 'configs/app/config';

import { ROUTES } from './routes';
import type { RouteName } from './routes';

const PATH_PARAM_REGEXP = /\/\[(\w+)\]/g;

export default function link(
  routeName: RouteName,
  urlParams?: Record<string, Array<string> | string | undefined>,
  queryParams?: Record<string, string>,
): string {
  const route = ROUTES[routeName];
  if (!route) {
    return '';
  }

  const path = route.pattern.replace(PATH_PARAM_REGEXP, (_, paramName: string) => {
    let paramValue = urlParams?.[paramName];
    if (Array.isArray(paramValue)) {
      // FIXME we don't have yet params as array, but typescript says that we could
      // dunno know how to manage it, fix me if you find an issue
      paramValue = paramValue.join(',');
    }

    return paramValue ? `/${ paramValue }` : '';
  });

  const url = new URL(path, appConfig.baseUrl);

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
}
