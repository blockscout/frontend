import dotenv from 'dotenv';

import { afterAll, afterEach, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

import { matchesViewport, resetViewport } from './utils/mockViewport';

const envs = dotenv.config({ path: './vitest/.env.vitest', quiet: true });

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

Object.defineProperty(globalThis, '__envs', {
  writable: true,
  value: envs.parsed || {},
});

// A spec in the shared project hands its worker on to the next spec file, so nothing a test set up
// may outlive it: fake timers would freeze the next file, and a queued fetch response would answer
// a request it was never meant for. Spies and stubs are undone here as well as by the config
// (restoreMocks / unstubGlobals / unstubEnvs in vitest.config.ts): Vitest applies those flags before
// a test starts, not after it ends, so on their own they leave the last test of a file in place
// while the next file is evaluated and runs its `beforeAll`.
afterEach(() => {
  vi.useRealTimers();
  fetchMocker.resetMocks();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

// The color-mode provider (next-themes) re-enables css transitions from a 1ms timeout that touches
// `document`. When that is still pending as a spec file ends, it fires after the jsdom environment
// is gone — harmless in a worker that dies with the file, an uncaught ReferenceError in a shared
// worker that has moved on to the next file. Outlasting it here lets it run while `document` exists.
afterAll(async() => {
  if (typeof document !== 'undefined') {
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
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
