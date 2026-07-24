import { vi } from 'vitest';

// next/router mocking for Vitest.
//
// Default: vitest/setup.ts registers a home-page mock via `vi.mock` so TestApp mounts
// without each suite wiring the router. Suites that need a specific route/query should
// override with their own top-level `vi.mock('next/router', …)` (see useQueryWithPages.spec).
//
// Primed drift tests: `mockNextRouter` uses `vi.doMock`, which applies only to modules
// imported AFTER the call — pair it with `resetModules` + dynamic imports
// (checkPrimedRequests.tsx), and clean up with `vi.doUnmock('next/router')`.
// `buildRouterMock` is the shared shape used by both paths.

export function buildRouterMock(page: string, url: string) {
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
    route: page,
    asPath: url,
    basePath: '',
    isReady: true,
    push: vi.fn(() => Promise.resolve(true)),
    replace: vi.fn(() => Promise.resolve(true)),
    prefetch: vi.fn(() => Promise.resolve()),
    back: vi.fn(),
    events: { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
  };
}

export function mockNextRouter(page: string, url: string) {
  const router = buildRouterMock(page, url);

  vi.doMock('next/router', () => ({
    useRouter: () => router,
    'default': router,
  }));

  return router;
}
