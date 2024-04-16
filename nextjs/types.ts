import type { NextPage } from 'next';

import type { Route } from 'nextjs-routes';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
}

export interface RouteParams<Pathname extends Route['pathname']> {
  pathname: Pathname;
  query?: Route['query'];
}
