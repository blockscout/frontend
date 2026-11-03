// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';
import type { Route } from 'src/shared/router/routes';

const CANONICAL_ROUTES: Array<Route['pathname']> = [
  '/',
  '/txs',
  '/ops',
  '/verified-contracts',
  '/name-services',
  '/withdrawals',
  '/tokens',
  '/stats',
  '/api-docs',
  '/gas-tracker',
  '/apps',
];

export default function getCanonicalUrl(pathname: Route['pathname']) {
  if (CANONICAL_ROUTES.includes(pathname)) {
    return config.app.baseUrl + pathname;
  }
}
