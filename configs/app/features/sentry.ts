import type { Feature } from './types';

import app from '../app';
import { getEnvValue } from '../utils';

const dsn = getEnvValue('NEXT_PUBLIC_SENTRY_DSN');
const instance = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_APP_INSTANCE');
  if (envValue) {
    return envValue;
  }

  return app.host?.replace('.blockscout.com', '').replaceAll('-', '_');
})();
const environment = getEnvValue('NEXT_PUBLIC_APP_ENV') || 'production';
const release = getEnvValue('NEXT_PUBLIC_GIT_TAG');
const title = 'Sentry error monitoring';

const config: Feature<{
  dsn: string;
  instance: string;
  release: string | undefined;
  environment: string;
  enableTracing: boolean;
}> = (() => {
  if (dsn && instance && environment) {
    return Object.freeze({
      title,
      isEnabled: true,
      dsn,
      instance,
      release,
      environment,
      enableTracing: getEnvValue('NEXT_PUBLIC_SENTRY_ENABLE_TRACING') === 'true',
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
