import type { Router } from 'src/toolkit/router/types';

import { vi } from 'vitest';

// A frozen router value for Vitest, installed through the `router` prop of the `vitest/lib` wrapper.
// `page` is the route pattern (`/tx/[hash]`), `url` the path and query the page is opened at.
//
// `query` never changes after a `push`/`replace` — the calls are `vi.fn` spies to assert on. A hook
// that must observe the URL it pushed uses routerStandIn.ts instead.

export interface RouterMock extends Router {
  push: ReturnType<typeof vi.fn<Router['push']>>;
  replace: ReturnType<typeof vi.fn<Router['replace']>>;
}

export function buildRouterMock(page: string, url: string): RouterMock {
  const { pathname, searchParams } = new URL(url, 'http://localhost');

  const query: Record<string, string> = Object.fromEntries(searchParams.entries());
  const patternParts = page.split('/');
  const pathParts = pathname.split('/');
  patternParts.forEach((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      query[part.slice(1, -1)] = pathParts[index] ?? '';
    }
  });

  return {
    query,
    pathname: page,
    asPath: url,
    push: vi.fn<Router['push']>(() => Promise.resolve(true)),
    replace: vi.fn<Router['replace']>(() => Promise.resolve(true)),
  };
}
