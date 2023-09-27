import type { Feature } from './types';

import { getEnvValue } from '../utils';

const dsn = getEnvValue(process.env.NEXT_PUBLIC_SENTRY_DSN);
const instance = getEnvValue(process.env.NEXT_PUBLIC_APP_INSTANCE);
const environment = instance?.startsWith('dev_') ? 'development' : 'production';
const release = environment === 'development' ? getEnvValue(process.env.NEXT_PUBLIC_GIT_COMMIT_SHA) : getEnvValue(process.env.NEXT_PUBLIC_GIT_TAG);

const title = 'Sentry error monitoring';

const config: Feature<{
  dsn: string;
  cspReportUrl: string | undefined;
  instance: string;
  release: string;
  environment: 'development' | 'production';
}> = (() => {
  if (dsn && instance && release) {
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
