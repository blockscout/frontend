import React from 'react';

import type { Router, RouterContextValue } from 'src/toolkit/router/types';

import { RouterProvider } from 'src/toolkit/router/context';
import { DefaultLink } from 'src/toolkit/router/defaults';

import { vi } from 'vitest';
import { wrapper as TestApp } from 'vitest/lib';

// A live router stand-in for Vitest, installed through the toolkit router provider.
//
// `buildRouterMock` (mockRouter.ts) freezes `query`, so a hook under test never sees the URL it
// pushed. This one holds `pathname` and `query` in a store: every `useRouter` consumer re-renders
// on `push`/`replace`/`setQuery`, and `push` resolves only after that render has committed — the
// same ordering the real pages router gives `.then` callbacks — so a spec can count requests and
// renders per user action, not just check the final state.
//
// Install from the spec with the `wrapper`; it is the innermost provider, so it wins over the frozen
// `buildRouterMock` value that `vitest/lib`'s TestApp mounts when the two are nested:
//
//   import { routerStandIn } from 'vitest/utils/routerStandIn';
//
//   beforeEach(() => routerStandIn.reset({ pathname: '/blocks', query: {} }));
//   afterEach(cleanup);   // RTL does not auto-unmount without vitest globals; stale consumers would re-render on reset
//   renderHook(() => useMyHook(), { wrapper: routerStandIn.wrapper });
//   renderHook(() => useMyQuery(), { wrapper: routerStandIn.appWrapper });   // inside the TestApp stack
//   render(<RouterStandInProvider><MyPage/></RouterStandInProvider>);          // inside vitest/lib's render()
//   act(() => routerStandIn.setQuery({ tab: 'txs' }));   // external URL change (tab switch, back button)
//   expect(routerStandIn.query).toEqual({ page: '2' });

type Query = Router['query'];

interface RouterLocation {
  readonly pathname: string;
  readonly query: Query;
}

interface RouterSnapshot extends RouterLocation {
  readonly version: number;
}

interface PendingTransition {
  readonly version: number;
  readonly resolve: (value: boolean) => void;
}

type UrlInput = string | { readonly pathname?: string; readonly query?: Record<string, unknown> | null };

const INITIAL_LOCATION: RouterLocation = { pathname: '/', query: {} };

let snapshot: RouterSnapshot = { ...INITIAL_LOCATION, version: 0 };
const listeners = new Set<() => void>();
const pendingTransitions: Array<PendingTransition> = [];

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): RouterSnapshot {
  return snapshot;
}

function commit(location: RouterLocation): number {
  snapshot = { ...location, version: snapshot.version + 1 };
  listeners.forEach((listener) => listener());
  return snapshot.version;
}

function settle(renderedVersion: number): void {
  for (let index = pendingTransitions.length - 1; index >= 0; index--) {
    const transition = pendingTransitions[index];
    if (transition.version <= renderedVersion) {
      pendingTransitions.splice(index, 1);
      transition.resolve(true);
    }
  }
}

function normalizeQuery(query: Record<string, unknown> | null | undefined): Query {
  const result: Record<string, string | Array<string>> = {};
  for (const [ key, value ] of Object.entries(query ?? {})) {
    if (value === undefined || value === null) {
      continue;
    }
    result[key] = Array.isArray(value) ? value.map(String) : String(value);
  }
  return result;
}

function toLocation(url: UrlInput): RouterLocation {
  if (typeof url === 'string') {
    const { pathname, searchParams } = new URL(url, 'http://localhost');
    return { pathname, query: Object.fromEntries(searchParams.entries()) };
  }

  return {
    pathname: url.pathname ?? snapshot.pathname,
    query: normalizeQuery(url.query),
  };
}

function transition(url: UrlInput): Promise<boolean> {
  const version = commit(toLocation(url));
  return new Promise<boolean>((resolve) => {
    pendingTransitions.push({ version, resolve });
    // nobody rendering `useRouter` means nobody settles the transition; a real router resolves anyway
    setTimeout(() => settle(version));
  });
}

function toAsPath({ pathname, query }: RouterLocation): string {
  const searchParams = new URLSearchParams();
  for (const [ key, value ] of Object.entries(query)) {
    (Array.isArray(value) ? value : [ value ]).forEach((item) => item !== undefined && searchParams.append(key, item));
  }
  const search = searchParams.toString();
  return search ? `${ pathname }?${ search }` : pathname;
}

const push = vi.fn((url: UrlInput) => transition(url));
const replace = vi.fn((url: UrlInput) => transition(url));

function useRouter(): Router {
  const current = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  React.useLayoutEffect(() => {
    settle(current.version);
  }, [ current ]);

  return React.useMemo(() => ({
    pathname: current.pathname,
    query: current.query,
    asPath: toAsPath(current),
    push,
    replace,
  }), [ current ]);
}

export function RouterStandInProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const value = React.useMemo((): RouterContextValue => ({
    Link: DefaultLink,
    router,
    pathname: new URL(router.asPath, 'http://localhost').pathname,
  }), [ router ]);

  return React.createElement(RouterProvider, { value, children });
}

function RouterStandInAppProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(TestApp, { children: React.createElement(RouterStandInProvider, { children }) });
}

export const routerStandIn = {
  get pathname(): string {
    return snapshot.pathname;
  },
  get query(): Query {
    return snapshot.query;
  },
  push,
  replace,
  setQuery(query: Query): void {
    commit({ pathname: snapshot.pathname, query });
  },
  setPathname(pathname: string): void {
    commit({ pathname, query: snapshot.query });
  },
  reset(location: Partial<RouterLocation> = {}): void {
    push.mockClear();
    replace.mockClear();
    pendingTransitions.length = 0;
    commit({ ...INITIAL_LOCATION, ...location });
  },
  useRouter,
  wrapper: RouterStandInProvider,
  appWrapper: RouterStandInAppProvider,
};
