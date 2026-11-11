import dotenv from 'dotenv';

import { afterEach, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

import { matchesViewport, resetViewport } from './utils/mockViewport';

const envs = dotenv.config({ path: './vitest/.env.vitest', quiet: true });

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

// browser APIs that jsdom does not implement but app components rely on
if (typeof window !== 'undefined') {
  resetViewport();
  afterEach(resetViewport);

  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        get matches() {
          return matchesViewport(query);
        },
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
