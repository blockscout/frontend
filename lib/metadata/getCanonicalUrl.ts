import type { Route } from 'nextjs-routes';

import config from 'configs/app';

const CANONICAL_ROUTES: Array<Route['pathname']> = [
  '/',
  '/txs',
  '/ops',
  '/verified-contracts',
  '/name-domains',
  '/withdrawals',
  '/tokens',
  '/stats',
  '/api-docs',
  '/graphiql',
  '/gas-tracker',
  '/apps',
];

export default function getCanonicalUrl(pathname: Route['pathname']) {
  if (CANONICAL_ROUTES.includes(pathname)) {
    return config.app.baseUrl + pathname;
  }
}
