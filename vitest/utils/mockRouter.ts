import { vi } from 'vitest';

// A next/router mock for a concrete page + url. `buildRouterMock` returns the router object
// (route params extracted from the url by matching the page pattern, e.g. '/tx/[hash]');
// `mockNextRouter` registers it via `vi.doMock`, which applies to modules imported AFTER the
// call — pair it with dynamic imports (see checkPrimedRequests.tsx), and clean up with
// `vi.doUnmock('next/router')`.

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
