function wait() {
  return new Promise(resolve => setTimeout(resolve, 500));
}

export default function isGoogleAnalyticsLoaded(retries = 3): Promise<boolean> {
  if (!retries) {
    return Promise.resolve(false);
  }
  return typeof window.ga?.getAll === 'function' ? Promise.resolve(true) : wait().then(() => isGoogleAnalyticsLoaded(retries - 1));
}
