import type { Feature } from './types';

import app from '../app';
import { getEnvValue } from '../utils';

const dsn = getEnvValue(process.env.NEXT_PUBLIC_SENTRY_DSN);
const instance = (() => {
  const envValue = getEnvValue(process.env.NEXT_PUBLIC_APP_INSTANCE);
  if (envValue) {
    return envValue;
  }

  return app.host?.replace('.blockscout.com', '').replaceAll('-', '_');
})();
const environment = getEnvValue(process.env.NEXT_PUBLIC_APP_ENV) || 'production';
const release = getEnvValue(process.env.NEXT_PUBLIC_GIT_TAG);

const title = 'Sentry error monitoring';

const config: Feature<{
  dsn: string;
  cspReportUrl: string | undefined;
  instance: string;
  release: string | undefined;
  environment: string;
}> = (() => {
  if (dsn && instance && environment) {
    return Object.freeze({
      title,
      isEnabled: true,
      dsn,
      cspReportUrl: getEnvValue(process.env.SENTRY_CSP_REPORT_URI),
      instance,
      release,
      environment,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
