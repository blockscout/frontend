import type { Feature } from './types';

import { getEnvValue } from '../utils';

const dsn = getEnvValue(process.env.NEXT_PUBLIC_SENTRY_DSN);

const title = 'Sentry error monitoring';

const config: Feature<{ dsn: string; environment: string | undefined; cspReportUrl: string | undefined; instance: string | undefined }> = (() => {
  if (dsn) {
    return Object.freeze({
      title,
      isEnabled: true,
      dsn,
      environment: getEnvValue(process.env.NEXT_PUBLIC_APP_ENV) || getEnvValue(process.env.NODE_ENV),
      cspReportUrl: getEnvValue(process.env.SENTRY_CSP_REPORT_URI),
      instance: getEnvValue(process.env.NEXT_PUBLIC_APP_INSTANCE),
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
