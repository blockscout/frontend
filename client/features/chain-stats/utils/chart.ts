// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';

import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

export function getChartUrl(href?: Route) {
  return href ? `${ config.app.baseUrl }${ route(href) }` : undefined;
}
