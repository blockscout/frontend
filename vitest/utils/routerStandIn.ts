import type { NextRouter } from 'next/router';
import React from 'react';

import { vi } from 'vitest';

// A live next/router stand-in for Vitest.
//
// `buildRouterMock` (mockRouter.ts) freezes `query`, so a hook under test never sees the URL it
// pushed. This one holds `pathname` and `query` in a store: every `useRouter` consumer re-renders
// on `push`/`replace`/`setQuery`, and `push` resolves only after that render has committed — the
// same ordering the real pages router gives `.then` callbacks — so a spec can count requests and
// renders per user action, not just check the final state.
//
// Install from the spec, not globally:
//
//   vi.mock('next/router', () => import('vitest/utils/routerStandIn').then((m) => m.nextRouterModule));
//   import { routerStandIn } from 'vitest/utils/routerStandIn';
//
//   beforeEach(() => routerStandIn.reset({ pathname: '/blocks', query: {} }));
//   afterEach(cleanup);   // RTL does not auto-unmount without vitest globals; stale consumers would re-render on reset
//   act(() => routerStandIn.setQuery({ tab: 'txs' }));   // external URL change (tab switch, back button)
//   expect(routerStandIn.query).toEqual({ page: '2' });

type Query = NextRouter['query'];

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

function useRouter(): NextRouter {
  const current = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  React.useLayoutEffect(() => {
    settle(current.version);
  }, [ current ]);

  return React.useMemo(() => ({
    pathname: current.pathname,
    route: current.pathname,
    query: current.query,
    asPath: toAsPath(current),
    basePath: '',
    isReady: true,
    isFallback: false,
    isPreview: false,
    isLocaleDomain: false,
    push,
    replace,
    prefetch: () => Promise.resolve(),
    back: () => {},
    forward: () => {},
    reload: () => {},
    beforePopState: () => {},
    events: { on: () => {}, off: () => {}, emit: () => {} },
    // the augmented `NextRouter` is a union over every route pattern; a stand-in cannot satisfy it statically
  }) as unknown as NextRouter, [ current ]);
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
};

export const nextRouterModule = {
  useRouter,
  'default': routerStandIn,
};
