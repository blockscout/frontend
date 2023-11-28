let ensurePageLoaded: Promise<void>;

if (typeof document === 'undefined' || document.readyState === 'complete') {
  ensurePageLoaded = Promise.resolve();
} else {
  ensurePageLoaded = new Promise<void>(resolve => {
    window.addEventListener('load', () => {
      resolve();
    });
  });
}

export { ensurePageLoaded };
