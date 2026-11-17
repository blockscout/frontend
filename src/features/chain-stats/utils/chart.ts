// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';
import type { Route } from 'src/shared/router/routes';
import { route } from 'src/shared/router/routes';

export function getChartUrl(href?: Route) {
  return href ? `${ config.app.baseUrl }${ route(href) }` : undefined;
}
