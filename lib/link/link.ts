import isBrowser from 'lib/isBrowser';
import findNetwork from 'lib/networks/findNetwork';

import { ROUTES } from './routes';
import type { RouteName } from './routes';

const PATH_PARAM_REGEXP = /\/\[(\w+)\]/g;

export function link(routeName: RouteName, urlParams?: Record<string, Array<string> | string | undefined>, queryParams?: Record<string, string>): string {
  const route = ROUTES[routeName];
  if (!route) {
    return '';
  }

  const network = findNetwork({
    network_type: typeof urlParams?.network_type === 'string' ? urlParams?.network_type : '',
    network_sub_type: typeof urlParams?.network_sub_type === 'string' ? urlParams?.network_sub_type : undefined,
  });

  const path = route.pattern.replace(PATH_PARAM_REGEXP, (_, paramName: string) => {
    if (paramName === 'network_sub_type' && !network?.subType) {
      return '';
    }

    let paramValue = urlParams?.[paramName];
    if (Array.isArray(paramValue)) {
      // FIXME we don't have yet params as array, but typescript says that we could
      // dun't know how to manage it, fix me if you find an issue
      paramValue = paramValue.join(',');
    }

    return paramValue ? `/${ paramValue }` : '';
  });

  const url = new URL(path, isBrowser() ? window.location.origin : 'https://blockscout.com');

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
}
