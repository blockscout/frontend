import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import config from 'configs/app';

export function getChartUrl(href?: Route) {
  return href ? `${ config.app.baseUrl }${ route(href) }` : undefined;
}
