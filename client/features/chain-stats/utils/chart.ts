// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import config from 'client/config';

export function getChartUrl(href?: Route) {
  return href ? `${ config.app.baseUrl }${ route(href) }` : undefined;
}
