import dotenv from 'dotenv';

import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

const envs = dotenv.config({ path: './vitest/.env.vitest' });

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

Object.defineProperty(globalThis, '__envs', {
  writable: true,
  value: envs.parsed || {},
});

// FontFaceObserver schedules document-touching timeouts that outlive the jsdom
// environment when page mounts tear down; primed (and other) layout mounts hit this.
vi.mock('use-font-face-observer', () => ({
  'default': () => true,
}));

// Default next/router so vitest/lib's TestApp.
vi.mock('next/router', async() => {
  const { buildRouterMock } = await import('./utils/mockRouter');
  const router = buildRouterMock('/', '/');
  return {
    useRouter: () => router,
    'default': router,
  };
});

// browser APIs that jsdom does not implement but app components rely on
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }

  window.ResizeObserver = window.ResizeObserver ?? class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.IntersectionObserver = window.IntersectionObserver ?? class {
    root = null;
    rootMargin = '';
    thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
  window.scrollTo = window.scrollTo ?? (() => {});
  Element.prototype.scrollTo = Element.prototype.scrollTo ?? (() => {});
  Element.prototype.scrollIntoView = Element.prototype.scrollIntoView ?? (() => {});
}
