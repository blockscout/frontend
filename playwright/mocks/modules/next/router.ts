import type { NextRouter } from 'next/router';

export { default, Router, withRouter } from 'next/dist/client/router';

const DEFAULT_ROUTER = {
  query: {},
  pathname: '',
  push: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
};

let routerOverrides: Partial<NextRouter> | undefined;

export function setRouterMock(overrides: Partial<NextRouter> | undefined): void {
  routerOverrides = overrides;
}

export function useRouter(): NextRouter {
  // Tests only stub the router fields the mounted component reads.
  return { ...DEFAULT_ROUTER, ...routerOverrides } as NextRouter;
}
