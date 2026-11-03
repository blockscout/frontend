// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NavigateOptions, Query, Router as ToolkitRouter } from 'src/toolkit/router/types';

import { useRouter as useToolkitRouter } from 'src/toolkit/router/context';

import type { Route } from './routes';

export type { NavigateOptions, Query };

// Mirrors the `next/router` augmentation in `nextjs-routes.d.ts`: a typed route, a route-less `{ query }`
// patch on the current page, or a plain href.
export type RouteUrl = Route | Omit<Route, 'pathname'> | string;

export interface Router extends Omit<ToolkitRouter, 'push' | 'replace'> {
  readonly pathname: Route['pathname'];
  push(url: RouteUrl, options?: NavigateOptions): Promise<boolean>;
  replace(url: RouteUrl, options?: NavigateOptions): Promise<boolean>;
}

export function useRouter(): Router {
  // the toolkit router is framework-neutral and carries no route map; the app narrows it to the generated routes
  return useToolkitRouter() as Router;
}
