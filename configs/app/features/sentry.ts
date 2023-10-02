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
const cspReportUrl = (() => {
  try {
    const url = new URL(getEnvValue('SENTRY_CSP_REPORT_URI') || '');

    // https://docs.sentry.io/product/security-policy-reporting/#additional-configuration
    url.searchParams.set('sentry_environment', environment);
    release && url.searchParams.set('sentry_release', release);

    return url.toString();
  } catch (error) {
    return;
  }
})();

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
      cspReportUrl,
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
