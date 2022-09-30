import appConfig from 'configs/app/config';

import { ROUTES } from './routes';
import type { RouteName } from './routes';

const PATH_PARAM_REGEXP = /\/\[(\w+)\]/g;

export function link(routeName: RouteName, urlParams?: Record<string, Array<string> | string | undefined>, queryParams?: Record<string, string>): string {
  const route = ROUTES[routeName];
  if (!route) {
    return '';
  }

  // if we pass network type, we have to get subtype from params too
  // otherwise getting it from config since it is not cross-chain link
  const networkSubType = typeof urlParams?.network_type === 'string' ? urlParams?.network_sub_type : appConfig.networkSubtype;

  const path = route.pattern.replace(PATH_PARAM_REGEXP, (_, paramName: string) => {
    if (paramName === 'network_sub_type' && !networkSubType) {
      return '';
    }

    let paramValue = urlParams?.[paramName];
    if (Array.isArray(paramValue)) {
      // FIXME we don't have yet params as array, but typescript says that we could
      // dunno know how to manage it, fix me if you find an issue
      paramValue = paramValue.join(',');
    }

    return paramValue ? `/${ paramValue }` : '';
  });

  const url = new URL(path, appConfig.domain);

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
}
