import config from 'configs/app';
import delay from 'lib/delay';

export default function isGoogleAnalyticsLoaded(retries = 3): Promise<boolean> {
  if (!retries || !config.features.googleAnalytics.isEnabled) {
    return Promise.resolve(false);
  }
  return typeof window.ga?.getAll === 'function' ? Promise.resolve(true) : delay(500).then(() => isGoogleAnalyticsLoaded(retries - 1));
}
